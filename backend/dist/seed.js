"use strict";
// ================================================================
// DATABASE SEED FILE (Backend)
// Populates the backend database with initial/demo data for login
// Run inside backend/: npm run db:seed
// ================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Starting backend database seed...");
    // Clear existing data (order matters)
    await prisma.submission.deleteMany();
    await prisma.assignment.deleteMany();
    await prisma.mark.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.message.deleteMany();
    await prisma.notice.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.student.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.user.deleteMany();
    await prisma.section.deleteMany();
    await prisma.class.deleteMany();
    await prisma.siteStat.deleteMany();
    await prisma.galleryItem.deleteMany();
    await prisma.staffProfile.deleteMany();
    console.log("🗑️  Cleared existing data");
    // Classes & Sections
    const class10 = await prisma.class.create({ data: { name: "Class 10" } });
    const sec10A = await prisma.section.create({ data: { name: "A", classId: class10.id } });
    console.log("✅ Classes & Sections created");
    // Users: Admin, Teacher, Student
    const hashedPassword = await bcryptjs_1.default.hash("password123", 10);
    // Admin
    await prisma.user.create({
        data: {
            email: "admin@school.com",
            password: hashedPassword,
            role: "ADMIN",
            name: "System Administrator",
        },
    });
    // Teacher
    const teacherUser = await prisma.user.create({
        data: {
            email: "taznurul@teacher.com",
            password: hashedPassword,
            role: "TEACHER",
            name: "A H M Taznorul Islam",
            phone: "01711000001",
        },
    });
    // Student
    const studentUser = await prisma.user.create({
        data: {
            email: "mahmud@student.com",
            password: hashedPassword,
            role: "STUDENT",
            name: "Al Mahmud",
        },
    });
    // Profiles
    const teacher = await prisma.teacher.create({
        data: {
            userId: teacherUser.id,
            specialization: "Mathematics",
            photoUrl: "",
            bio: "Senior Mathematics teacher with a passion for inspiring students to love problem solving.",
            qualifications: "MSc in Mathematics, B.Ed",
            experience: "8+ years teaching at Mohishaban M Alim Madrasah.",
        },
    });
    const student = await prisma.student.create({
        data: { userId: studentUser.id, rollNo: 15, sectionId: sec10A.id },
    });
    console.log("✅ Users (Admin, Teacher, Student) created");
    // Simple subject to satisfy relations
    const mathSubject = await prisma.subject.create({
        data: {
            name: "Mathematics",
            code: "MATH-10A",
            sectionId: sec10A.id,
            teacherId: teacher.id,
        },
    });
    // Minimal attendance + mark so dashboards have some data
    const today = new Date();
    await prisma.attendance.create({
        data: {
            date: today,
            status: "PRESENT",
            studentId: student.id,
            subjectId: mathSubject.id,
        },
    });
    await prisma.mark.create({
        data: {
            examType: "MID",
            score: 80,
            totalScore: 100,
            studentId: student.id,
            subjectId: mathSubject.id,
        },
    });
    // Default notices
    await prisma.notice.createMany({
        data: [
            {
                title: "Welcome to Mohishaban M Alim Madrasah",
                content: "Classes are running as usual. Please check the academic calendar for upcoming exams and events.",
                type: "GENERAL",
            },
            {
                title: "Monthly Attendance Review Meeting",
                content: "All class teachers are requested to submit their monthly attendance report by Thursday.",
                type: "ACADEMIC",
            },
        ],
    });
    // Default gallery items
    await prisma.galleryItem.createMany({
        data: [
            {
                title: "Annual Sports Day",
                imageUrl: "https://images.pexels.com/photos/267761/pexels-photo-267761.jpeg",
                description: "Students participating enthusiastically in the annual sports events.",
            },
            {
                title: "Quran Recitation Program",
                imageUrl: "https://images.pexels.com/photos/159279/koran-quran-arabic-islam-159279.jpeg",
                description: "Special Quran recitation and dua mahfil at the madrasah hall.",
            },
        ],
    });
    // Default staff/leadership
    await prisma.staffProfile.createMany({
        data: [
            {
                name: "A H M Taznorul Islam",
                role: "Head of Institution",
                bio: "Principal of Mohishaban M Alim Madrasah with a focus on both deen and dunya education.",
                imageUrl: "",
                isHead: true,
                sortOrder: 0,
            },
            {
                name: "Rafiqul Islam",
                role: "Senior Mathematics Teacher",
                bio: "Class 10 coordinator and exam committee member.",
                imageUrl: "",
                isHead: false,
                sortOrder: 1,
            },
            {
                name: "Salma Begum",
                role: "Science & ICT Teacher",
                bio: "Leads science fair projects and STEM clubs.",
                imageUrl: "",
                isHead: false,
                sortOrder: 2,
            },
            {
                name: "Abdullah Al Noman",
                role: "Arabic & Quran Teacher",
                bio: "Responsible for Hifz and Tilawat sessions.",
                imageUrl: "",
                isHead: false,
                sortOrder: 3,
            },
        ],
    });
    // Default homepage stats
    await prisma.siteStat.createMany({
        data: [
            { key: "TOTAL_STUDENTS", label: "Total Students", value: "1500+" },
            { key: "TOTAL_TEACHERS", label: "Total Teachers", value: "120+" },
            { key: "ACHIEVEMENTS", label: "Achievements", value: "50+" },
            { key: "SUCCESS_RATE", label: "Success Rate", value: "99%" },
        ],
    });
    // Default events / calendar
    const eventDate = new Date();
    const makeDate = (offsetDays) => {
        const d = new Date(eventDate);
        d.setDate(d.getDate() + offsetDays);
        return d;
    };
    await prisma.event.createMany({
        data: [
            {
                title: "Monthly Parent-Teacher Meeting",
                date: makeDate(3),
                type: "ACADEMIC",
                description: "Discussion on student performance and upcoming exams.",
                imageUrl: "",
            },
            {
                title: "Annual Sports Day",
                date: makeDate(10),
                type: "CULTURAL",
                description: "Whole day sports competition and prize-giving ceremony.",
                imageUrl: "",
            },
            {
                title: "Mid-Term Examination Week",
                date: makeDate(20),
                type: "ACADEMIC",
                description: "Class 6–10 mid-term written examinations.",
                imageUrl: "",
            },
        ],
    });
    // Default routine entries (Class 10 A)
    await prisma.routineEntry.createMany({
        data: [
            {
                className: "Class 10",
                section: "A",
                dayOfWeek: "SAT",
                startTime: "09:00",
                endTime: "09:45",
                subject: "Mathematics",
                teacherName: "Rafiqul Islam",
                room: "Room 101",
            },
            {
                className: "Class 10",
                section: "A",
                dayOfWeek: "SAT",
                startTime: "10:00",
                endTime: "10:45",
                subject: "Bangla",
                teacherName: "Salma Begum",
                room: "Room 101",
            },
            {
                className: "Class 10",
                section: "A",
                dayOfWeek: "SUN",
                startTime: "09:00",
                endTime: "09:45",
                subject: "English",
                teacherName: "Guest Teacher",
                room: "Room 101",
            },
        ],
    });
    console.log("\n🎉 Backend seed completed successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Admin:   admin@school.com / password123");
    console.log("Teacher: rafiqul@school.com / password123");
    console.log("Student: john@school.com / password123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}
main()
    .catch((e) => {
    console.error("❌ Backend seed failed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map