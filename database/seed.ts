// ================================================================
// DATABASE SEED FILE
// Populates the database with initial/demo data for development
// Run: npx prisma db seed
// ================================================================

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
async function main() {
    console.log("🌱 Starting database seed...");

    // -----------------------------------------------------------------
    // 1. Clean existing data (order matters due to foreign keys)
    // -----------------------------------------------------------------
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

    console.log("🗑️  Cleared existing data");

    // -----------------------------------------------------------------
    // 2. Create Classes & Sections
    // -----------------------------------------------------------------
    const class10 = await prisma.class.create({ data: { name: "Class 10" } });
    const class9 = await prisma.class.create({ data: { name: "Class 9" } });
    const class8 = await prisma.class.create({ data: { name: "Class 8" } });

    const sec10A = await prisma.section.create({ data: { name: "A", classId: class10.id } });
    await prisma.section.create({ data: { name: "B", classId: class10.id } });
    await prisma.section.create({ data: { name: "C", classId: class9.id } });
    await prisma.section.create({ data: { name: "B", classId: class8.id } });

    console.log("✅ Classes & Sections created");

    // -----------------------------------------------------------------
    // 3. Create Users: Admin, Teachers, Students
    // -----------------------------------------------------------------
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Admin
    await prisma.user.create({
        data: {
            email: "admin@school.com",
            password: hashedPassword,
            role: "ADMIN",
            name: "System Administrator",
        },
    });

    // Teachers
    const teacherUser1 = await prisma.user.create({
        data: {
            email: "rafiqul@school.com",
            password: hashedPassword,
            role: "TEACHER",
            name: "Rafiqul Islam",
            phone: "01711000001",
        },
    });

    const teacherUser2 = await prisma.user.create({
        data: {
            email: "salma@school.com",
            password: hashedPassword,
            role: "TEACHER",
            name: "Salma Begum",
            phone: "01711000002",
        },
    });

    // Create Teacher profiles
    const teacher1 = await prisma.teacher.create({
        data: { userId: teacherUser1.id, specialization: "Mathematics" },
    });

    const teacher2 = await prisma.teacher.create({
        data: { userId: teacherUser2.id, specialization: "Science" },
    });

    // Students
    const studentUser1 = await prisma.user.create({
        data: {
            email: "john@school.com",
            password: hashedPassword,
            role: "STUDENT",
            name: "John Doe",
        },
    });

    const studentUser2 = await prisma.user.create({
        data: {
            email: "jane@school.com",
            password: hashedPassword,
            role: "STUDENT",
            name: "Jane Smith",
        },
    });

    // Create Student profiles
    const student1 = await prisma.student.create({
        data: { userId: studentUser1.id, rollNo: 15, sectionId: sec10A.id },
    });

    const student2 = await prisma.student.create({
        data: { userId: studentUser2.id, rollNo: 16, sectionId: sec10A.id },
    });

    console.log("✅ Users (Admin, Teachers, Students) created");

    // -----------------------------------------------------------------
    // 4. Create Subjects
    // -----------------------------------------------------------------
    const mathSubject = await prisma.subject.create({
        data: {
            name: "Mathematics",
            code: "MATH-10A",
            sectionId: sec10A.id,
            teacherId: teacher1.id,
        },
    });

    const physicsSubject = await prisma.subject.create({
        data: {
            name: "Physics",
            code: "PHY-10A",
            sectionId: sec10A.id,
            teacherId: teacher2.id,
        },
    });

    console.log("✅ Subjects created");

    // -----------------------------------------------------------------
    // 5. Create Attendance records
    // -----------------------------------------------------------------
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    await prisma.attendance.createMany({
        data: [
            { date: today, status: "PRESENT", studentId: student1.id, subjectId: mathSubject.id },
            { date: today, status: "PRESENT", studentId: student2.id, subjectId: mathSubject.id },
            { date: yesterday, status: "ABSENT", studentId: student1.id, subjectId: physicsSubject.id },
            { date: yesterday, status: "PRESENT", studentId: student2.id, subjectId: physicsSubject.id },
        ],
    });

    console.log("✅ Attendance records created");

    // -----------------------------------------------------------------
    // 6. Create Marks
    // -----------------------------------------------------------------
    await prisma.mark.createMany({
        data: [
            { examType: "MID", score: 80, totalScore: 100, studentId: student1.id, subjectId: mathSubject.id },
            { examType: "FINAL", score: 88, totalScore: 100, studentId: student1.id, subjectId: physicsSubject.id },
            { examType: "CLASS_TEST", score: 18, totalScore: 20, studentId: student2.id, subjectId: mathSubject.id },
            { examType: "MID", score: 75, totalScore: 100, studentId: student2.id, subjectId: physicsSubject.id },
        ],
    });

    console.log("✅ Marks created");

    // -----------------------------------------------------------------
    // 7. Create Assignments & Submissions
    // -----------------------------------------------------------------
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 7);

    const assignment1 = await prisma.assignment.create({
        data: {
            title: "Quadratic Equations - Problem Set 5",
            description: "Solve all 20 problems from Chapter 5. Show working.",
            dueDate,
            subjectId: mathSubject.id,
        },
    });

    await prisma.submission.create({
        data: {
            studentId: student1.id,
            assignmentId: assignment1.id,
            fileUrl: "/uploads/john-assignment1.pdf",
        },
    });

    console.log("✅ Assignments & Submissions created");

    // -----------------------------------------------------------------
    // 8. Create Notices
    // -----------------------------------------------------------------
    await prisma.notice.createMany({
        data: [
            {
                title: "Monthly Class Test Schedule Published",
                content: "Tests will be held from Oct 15 to Oct 22. All students must be present.",
                type: "ACADEMIC",
            },
            {
                title: "School Closed for Autumn Vacation",
                content: "School will be closed from Oct 13 to Oct 18 due to Autumn break.",
                type: "GENERAL",
            },
            {
                title: "Science Fair 2026 Registration Open",
                content: "Register your project before Oct 30. Winners get special scholarship.",
                type: "ACADEMIC",
            },
            {
                title: "Emergency Parent-Teacher Meeting",
                content: "All parents are requested to attend on Saturday at 10:00 AM.",
                type: "EMERGENCY",
            },
        ],
    });

    console.log("✅ Notices created");

    // -----------------------------------------------------------------
    // 9. Create Messages
    // -----------------------------------------------------------------
    await prisma.message.create({
        data: {
            content: "Please submit the math assignment before Friday.",
            senderId: teacherUser1.id,
            receiverId: studentUser1.id,
        },
    });

    console.log("✅ Messages created");
    console.log("\n🎉 Seed completed successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Admin:   admin@school.com / password123");
    console.log("Teacher: rafiqul@school.com / password123");
    console.log("Student: john@school.com / password123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
