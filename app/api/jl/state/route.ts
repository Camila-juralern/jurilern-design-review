import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { members } from '@/lib/db/schema'
import { buildState, getMember } from '@/lib/jurilern/member'

export const dynamic = 'force-dynamic'

export async function GET() {
  const member = await getMember()
  if (!member) return Response.json({ me: null })
  await db.update(members).set({ lastSeen: new Date() }).where(eq(members.id, member.id))
  return Response.json(await buildState(member))
}
