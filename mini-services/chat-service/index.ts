import { Server } from 'socket.io';

const io = new Server({
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  console.log('Chat client connected:', socket.id);

  socket.on('join', (userId: string) => {
    socket.join(`user:${userId}`);
    socket.data.userId = userId;
  });

  socket.on('message', (data: { senderId: string; receiverId: string; content: string; type?: string }) => {
    const msg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      ...data,
      chatType: 'direct',
      isRead: false,
      isDeleted: false,
      type: data.type || 'text',
      createdAt: new Date().toISOString(),
    };
    socket.to(`user:${data.receiverId}`).emit('new-message', msg);
    socket.emit('message-sent', msg);
  });

  socket.on('typing', (data: { receiverId: string }) => {
    socket.to(`user:${data.receiverId}`).emit('user-typing', { userId: socket.data.userId });
  });

  socket.on('online', (userId: string) => {
    socket.broadcast.emit('user-online', { userId });
  });

  socket.on('disconnect', () => {
    if (socket.data.userId) {
      socket.broadcast.emit('user-offline', { userId: socket.data.userId });
    }
  });
});

io.listen(3001);
console.log('Chat service running on port 3001');
