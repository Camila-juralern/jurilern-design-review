import { and, desc, eq, gt, ne } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { createHash, randomBytes } from 'node:crypto'
import { db } from '@/lib/db'
import { members, rooms, sessions, type Member } from '@/lib/db/schema'
import { ONLINE_WINDOW_MS } from './catalog'

const COOKIE = 'jl_member'
const isDev = process.env.NODE_ENV === 'development'

export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')
export const newToken = () => randomBytes(32).toString('base64url')

export async function setMemberCookie(token: string) {
  const jar = await cookies()
  jar.set(COOKIE, token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 180,
    sameSite: isDev ? 'none' : 'lax',
    secure: isDev ? true : process.env.NODE_ENV === 'production',
  })
}

export async function clearMemberCookie() {
  (await cookies()).delete(COOKIE)
}

export async function getMember(): Promise<Member | null> {
  const token = (await cookies()).get(COOKIE)?.value
  if (!token) return null
  const [member] = await db.select().from(members).where(eq(members.tokenHash, hashToken(token))).limit(1)
  return member ?? null
}

export function normalizeRoomCode(value: unknown) {
  return String(value ?? '').trim().toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 16)
}

export async function buildState(member: Member) {
  const [room] = await db.select().from(rooms).where(eq(rooms.code, member.roomCode)).limit(1)
  const since = new Date(Date.now() - ONLINE_WINDOW_MS)

  const people = await db
    .select({
      id: members.id,
      name: members.name,
      points: members.points,
      avatar: members.avatar,
      customization: members.customization,
      completed: members.completed,
      focusStartedAt: members.focusStartedAt,
      focusMinutes: members.focusMinutes,
      lastSeen: members.lastSeen,
    })
    .from(members)
    .where(eq(members.roomCode, member.roomCode))
    .orderBy(desc(members.points))
    .limit(100)

  const recent = await db
    .select({ id: sessions.id, minutes: sessions.minutes, points: sessions.points, completedAt: sessions.completedAt })
    .from(sessions)
    .where(and(eq(sessions.memberId, member.id), eq(sessions.roomCode, member.roomCode)))
    .orderBy(desc(sessions.completedAt))
    .limit(30)

  const focusing = (m: { focusStartedAt: Date | null; focusMinutes: number | null; lastSeen?: Date }) =>
    !!m.focusStartedAt &&
    !!m.focusMinutes &&
    (!m.lastSeen || m.lastSeen > since) &&
    Date.now() - m.focusStartedAt.getTime() < (m.focusMinutes + 15) * 60_000

  return {
    me: {
      id: member.id,
      name: member.name,
      points: member.points,
      completed: member.completed,
      avatar: member.avatar,
      ownedAvatars: member.ownedAvatars,
      customization: member.customization,
      todos: member.todos,
      focusing: focusing(member),
    },
    room: {
      code: member.roomCode,
      teamPoints: room?.teamPoints ?? 0,
      decor: room?.decor ?? null,
      ownedDecor: room?.ownedDecor ?? [],
      customization: room?.customization ?? { owned: [], wall: 'indigo', floor: 'oak' },
    },
    members: people
      .filter((person) => person.id !== member.id)
      .map((person) => ({
        id: person.id,
        name: person.name,
        points: person.points,
        avatar: person.avatar,
        customization: person.customization,
        completed: person.completed,
        focusing: focusing(person),
      })),
    history: recent.map((session) => ({
      id: session.id,
      minutes: session.minutes,
      points: session.points,
      completedAt: session.completedAt,
    })),
  }
}
