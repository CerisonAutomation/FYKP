import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 10;
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      db.blog.findMany({
        where: { isPublished: true },
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatar: true, age: true, gender: true, location: true, isVerified: true, isPremium: true, online: true, lastSeen: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.blog.count({ where: { isPublished: true } }),
    ]);

    return NextResponse.json({
      blogs,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required as a query parameter" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { title, content, imageUrl, isPublished } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "title and content are required" },
        { status: 400 },
      );
    }

    const slug = generateSlug(title);

    const blog = await db.blog.create({
      data: {
        title,
        content,
        imageUrl: imageUrl ?? null,
        slug,
        userId,
        isPublished: isPublished ?? true,
      },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatar: true, age: true, gender: true, location: true, isVerified: true, isPremium: true, online: true, lastSeen: true },
        },
      },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
