import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { members } from '@/lib/db/schema'
import { getMember } from '@/lib/jurilern/member'

export async function POST() {
  const member = await getMember()
  if (member) {
    await db
      .update(members)
      .set({ lastSeen: new Date(0), focusStartedAt: null, focusMinutes: null })
      .where(eq(members.id, member.id))
  }
  await clearMemberCookie()
  return Response.json({ me: null })
}
