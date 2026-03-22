// app/api/admin/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const payload = getCurrentUser();
    if (!payload) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }
    if (payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    const stats = {
      total: users.length,
      admins: users.filter((u) => u.role === "ADMIN").length,
      users: users.filter((u) => u.role === "USER").length,
      todaySignups: users.filter((u) => {
        const d = new Date(u.createdAt);
        const now = new Date();
        return d.toDateString() === now.toDateString();
      }).length,
    };

    return NextResponse.json({ users, stats });
  } catch (error) {
    console.error("Admin fetch error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const payload = getCurrentUser();
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "User ID required." }, { status: 400 });
    }

    if (userId === payload.id) {
      return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
