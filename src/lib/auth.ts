export const ME_ID = 'test-user-1';

export async function getMe() {
  const { db } = await import('./db');
  const user = await db.user.findUnique({ where: { id: ME_ID } });
  if (!user) throw new Error('No authenticated user');
  return user;
}
