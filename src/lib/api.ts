// ================================================================
// API Client — SchoolSpace Frontend
// Reusable fetch wrapper with auth, timeout, retry, error handling
// ================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    details?: unknown;
    pagination?: {
        total: number;
        page: number;
        limit: number;
    };
}

interface ApiOptions extends Omit<RequestInit, "body"> {
    body?: any;
    timeout?: number;
    retries?: number;
    skipAuth?: boolean;
}

class ApiError extends Error {
    public status: number;
    public details?: unknown;

    constructor(message: string, status: number, details?: unknown) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.details = details;
    }
}

function getAuthHeaders(): Record<string, string> {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T = any>(
    endpoint: string,
    options: ApiOptions = {}
): Promise<ApiResponse<T>> {
    const {
        timeout = 10000,
        retries = 1,
        skipAuth = false,
        body,
        headers: customHeaders,
        ...fetchOptions
    } = options;

    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
        ...(skipAuth ? {} : getAuthHeaders()),
        ...(customHeaders as Record<string, string> || {}),
    };

    // Don't set Content-Type for FormData (browser sets multipart boundary)
    if (body && !(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const config: RequestInit = {
        ...fetchOptions,
        headers,
        body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...config,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const data: ApiResponse<T> = await response.json();

            if (!response.ok) {
                throw new ApiError(
                    data.error || `Request failed with status ${response.status}`,
                    response.status,
                    data.details
                );
            }

            return data;
        } catch (err: any) {
            clearTimeout(timeoutId);

            if (err.name === "AbortError") {
                lastError = new ApiError("Request timeout. Please try again.", 408);
            } else if (err instanceof ApiError) {
                // Don't retry 4xx errors
                if (err.status >= 400 && err.status < 500) {
                    throw err;
                }
                lastError = err;
            } else {
                lastError = new ApiError(
                    "Network error. Please check your connection.",
                    0
                );
            }

            // Wait before retrying (exponential backoff)
            if (attempt < retries) {
                await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
            }
        }
    }

    throw lastError || new ApiError("Request failed.", 500);
}

// ─── Convenience Methods ────────────────────────────────────────

export const api = {
    get: <T = any>(endpoint: string, options?: ApiOptions) =>
        request<T>(endpoint, { ...options, method: "GET" }),

    post: <T = any>(endpoint: string, body?: any, options?: ApiOptions) =>
        request<T>(endpoint, { ...options, method: "POST", body }),

    put: <T = any>(endpoint: string, body?: any, options?: ApiOptions) =>
        request<T>(endpoint, { ...options, method: "PUT", body }),

    patch: <T = any>(endpoint: string, body?: any, options?: ApiOptions) =>
        request<T>(endpoint, { ...options, method: "PATCH", body }),

    delete: <T = any>(endpoint: string, options?: ApiOptions) =>
        request<T>(endpoint, { ...options, method: "DELETE" }),

    /** Upload with FormData — does NOT set Content-Type (browser handles it) */
    upload: <T = any>(endpoint: string, formData: FormData, method: "POST" | "PUT" = "POST", options?: ApiOptions) =>
        request<T>(endpoint, { ...options, method, body: formData }),
};

export { ApiError };
export type { ApiResponse };
