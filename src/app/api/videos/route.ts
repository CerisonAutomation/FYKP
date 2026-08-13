import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const userId = searchParams.get("userId");
    const limit = 10;
    const skip = (page - 1) * limit;

    const where = userId
      ? { OR: [{ isPrivate: false }, { userId }] }
      : { isPrivate: false };

    const [videos, total] = await Promise.all([
      db.video.findMany({
        where,
        include: { user: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.video.count({ where }),
    ]);

    return NextResponse.json({
      videos,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
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
    const { title, url, thumbnailUrl, duration, isPrivate } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: "title and url are required" },
        { status: 400 },
      );
    }

    const video = await db.video.create({
      data: {
        title,
        url,
        thumbnailUrl: thumbnailUrl ?? null,
        duration: duration ?? null,
        userId,
        isPrivate: isPrivate ?? false,
      },
      include: { user: true },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
