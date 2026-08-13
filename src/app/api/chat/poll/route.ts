import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface PollCreateBody {
  receiverId: string;
  question: string;
  options: string[];
  chatType?: string;
  groupId?: string;
}

interface PollVoteBody {
  messageId: string;
  optionIndex: number;
  userId: string;
}

// POST /api/chat/poll - send a poll message
export async function POST(request: NextRequest) {
  try {
    const body: PollCreateBody = await request.json();
    const { receiverId, question, options, chatType, groupId } = body;

    if (!receiverId || !question || !options || options.length < 2) {
      return NextResponse.json(
        { error: 'receiverId, question, and at least 2 options are required' },
        { status: 400 }
      );
    }

    const pollData = JSON.stringify({
      question,
      options,
      votes: options.map(() => []),
    });

    const message = await db.message.create({
      data: {
        content: `📊 Poll: ${question}`,
        senderId: 'test-user-1',
        receiverId,
        type: 'poll',
        pollData,
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

    return NextResponse.json({ data: message }, { status: 201 });
  } catch (error) {
    console.error('Poll create error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/chat/poll - vote on a poll
export async function PUT(request: NextRequest) {
  try {
    const body: PollVoteBody = await request.json();
    const { messageId, optionIndex, userId } = body;

    if (!messageId || optionIndex === undefined || !userId) {
      return NextResponse.json(
        { error: 'messageId, optionIndex, and userId are required' },
        { status: 400 }
      );
    }

    const message = await db.message.findUnique({ where: { id: messageId } });
    if (!message || !message.pollData) {
      return NextResponse.json(
        { error: 'Poll message not found' },
        { status: 404 }
      );
    }

    const pollData = JSON.parse(message.pollData);

    if (optionIndex < 0 || optionIndex >= pollData.options.length) {
      return NextResponse.json(
        { error: 'Invalid option index' },
        { status: 400 }
      );
    }

    // Remove existing vote from this user on any option
    for (let i = 0; i < pollData.votes.length; i++) {
      pollData.votes[i] = (pollData.votes[i] as string[]).filter(
        (uid: string) => uid !== userId
      );
    }

    // Add vote to selected option
    (pollData.votes[optionIndex] as string[]).push(userId);

    const updatedPollData = JSON.stringify(pollData);

    await db.message.update({
      where: { id: messageId },
      data: { pollData: updatedPollData },
    });

    return NextResponse.json({ pollData: updatedPollData });
  } catch (error) {
    console.error('Poll vote error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
