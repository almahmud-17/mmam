// ================================================================
// COMPONENT: SectionTitle
// Reusable section heading with gradient text support
// Usage: <SectionTitle title="Hello [gradient]World" subtitle="Tag" />
// "[gradient]" keyword in title renders that part with pink-purple gradient
// Location: frontend/components/ui/SectionTitle.tsx
// ================================================================

interface SectionTitleProps {
    title: string;
    subtitle?: string;
    centered?: boolean;
}

export function SectionTitle({ title, subtitle, centered = true }: SectionTitleProps) {
    // Split on the [gradient] marker
    const parts = title.split("[gradient]");
    const hasTwoParts = parts.length === 2;

    return (
        <div className={centered ? "text-center" : "text-left"}>
            {subtitle && (
                <p className="text-sm font-bold text-brand-pink uppercase tracking-[0.2em] mb-4">
                    {subtitle}
                </p>
            )}
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white leading-tight">
                {hasTwoParts ? (
                    <>
                        {parts[0]}
                        <span className="text-gradient">{parts[1]}</span>
                    </>
                ) : (
                    title
                )}
            </h2>
        </div>
    );
}
