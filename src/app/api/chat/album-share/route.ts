import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface AlbumShareBody {
  receiverId: string;
  albumId: string;
  chatType?: string;
  groupId?: string;
}

// POST /api/chat/album-share - share an album in chat
export async function POST(request: NextRequest) {
  try {
    const body: AlbumShareBody = await request.json();
    const { receiverId, albumId, chatType, groupId } = body;

    if (!receiverId || !albumId) {
      return NextResponse.json(
        { error: 'receiverId and albumId are required' },
        { status: 400 }
      );
    }

    // Fetch album with photos
    const album = await db.album.findUnique({
      where: { id: albumId },
      include: {
        photos: {
          select: {
            id: true,
            url: true,
            thumbnailUrl: true,
            width: true,
            height: true,
            isPrivate: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!album) {
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      );
    }

    const message = await db.message.create({
      data: {
        content: `🖼️ Shared album: ${album.name} (${album.photos.length} photos)`,
        senderId: 'test-user-1',
        receiverId,
        type: 'album',
        albumId,
        chatType: chatType || 'direct',
        groupId: groupId || null,
      },
      include: {
        sender: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
        receiver: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    return NextResponse.json({
      data: {
        ...message,
        album: {
          id: album.id,
          name: album.name,
          photos: album.photos,
        },
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Album share error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
