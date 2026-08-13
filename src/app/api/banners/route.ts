import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const banners = await db.banner.findMany({
      where: { isActive: true },
      include: { user: true },
      orderBy: { position: "asc" },
    });

    return NextResponse.json({ banners });
  } catch (error) {
    console.error("Error fetching banners:", error);
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
    const { title, imageUrl, linkUrl, position } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: "title and imageUrl are required" },
        { status: 400 },
      );
    }

    const banner = await db.banner.create({
      data: {
        title,
        imageUrl,
        linkUrl: linkUrl ?? null,
        position: position ?? 0,
        userId,
      },
      include: { user: true },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error("Error creating banner:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
