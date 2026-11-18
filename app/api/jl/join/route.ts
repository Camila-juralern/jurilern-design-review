import { db } from '@/lib/db'
import { members, rooms } from '@/lib/db/schema'
import { buildState, hashToken, newToken, normalizeRoomCode, setMemberCookie } from '@/lib/jurilern/member'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const name = String(body.name ?? '').trim().slice(0, 30)
  const roomCode = normalizeRoomCode(body.room)
  if (!name || roomCode.length < 3) {
    return Response.json({ error: 'Bitte gib einen Namen und eine Raumnummer (mind. 3 Zeichen) ein.' }, { status: 400 })
  }

  await db.insert(rooms).values({ code: roomCode }).onConflictDoNothing()

  const token = newToken()
  const [member] = await db
    .insert(members)
    .values({
      tokenHash: hashToken(token),
      roomCode,
      name,
      todos: [
        { id: 1, text: 'Lernziel für heute festlegen', done: false },
        { id: 2, text: '25 Minuten konzentriert lernen', done: false },
      ],
    })
    .returning()

  await setMemberCookie(token)
  return Response.json(await buildState(member))
}
