import { randomInt } from 'node:crypto'
import { and, desc, eq, gt, isNotNull, ne, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { members, rooms, sessions, type Member, type Todo } from '@/lib/db/schema'
import { AVATAR_PRICES, DECOR_PRICES, FOCUS_MINUTES, ONLINE_WINDOW_MS, REWARDS, STORE_ITEMS, LUCKBOX_PRICE, SPECIAL_LOOT } from '@/lib/jurilern/catalog'
import { buildState, getMember } from '@/lib/jurilern/member'

const fail = (error: string, status = 400) => Response.json({ error }, { status })
function cleanTodos(value: unknown): Todo[] | null {
  if (!Array.isArray(value) || value.length > 50) return null
  return value.map((t) => ({ id: Number(t?.id) || Date.now(), text: String(t?.text ?? '').trim().slice(0, 100), done: Boolean(t?.done) })).filter((t) => t.text)
}
export async function POST(request: Request) {
  const member = await getMember()
  if (!member) return fail('Nicht angemeldet', 401)
  const body = await request.json().catch(() => ({}))
  const type = String(body.type ?? '')
  const id = String(body.id ?? '')
  const result = await handle(member, type, id, body)
  if (typeof result === 'string') return fail(result)
  const [fresh] = await db.select().from(members).where(eq(members.id, member.id)).limit(1)
  return Response.json({ ...(await buildState(fresh)), ...(result ?? {}) })
}

async function handle(member: Member, type: string, id: string, body: Record<string, unknown>) {
  switch (type) {
    case 'select-avatar': {
      if (!member.ownedAvatars.includes(id)) return 'Charakter nicht freigeschaltet'
      await db.update(members).set({ avatar: id }).where(eq(members.id, member.id)); return
    }
    case 'buy-avatar': {
      const price = AVATAR_PRICES[id]
      if (price === undefined) return 'Dieser Charakter ist nur in einer Glücksbox erhältlich.'
      const updated = await db.update(members).set({ points: sql`${members.points} - ${price}`, ownedAvatars: sql`array_append(${members.ownedAvatars}, ${id})`, avatar: id }).where(and(eq(members.id, member.id), sql`${members.points} >= ${price}`, sql`NOT (${id} = ANY(${members.ownedAvatars}))`)).returning({ id: members.id })
      if (!updated.length) return 'Nicht genug persönliche Punkte oder bereits freigeschaltet'; return
    }
    case 'buy-luckbox': {
      const owned = member.customization?.owned ?? []
      const available = SPECIAL_LOOT.filter(item => item.category === 'avatar' ? !member.ownedAvatars.includes(item.id) : !owned.includes(item.id))
      if (!available.length) return 'Du hast alle besonderen Glücksbox-Gegenstände bereits freigeschaltet.'
      const prize = available[randomInt(available.length)]
      const updates = prize.category === 'avatar'
        ? { points: sql`${members.points} - ${LUCKBOX_PRICE}`, ownedAvatars: sql`array_append(${members.ownedAvatars}, ${prize.id})`, avatar: prize.id }
        : { points: sql`${members.points} - ${LUCKBOX_PRICE}`, customization: sql`jsonb_set(${members.customization}, '{owned}', coalesce(${members.customization}->'owned', '[]'::jsonb) || to_jsonb(${prize.id}::text))` }
      const opened = await db.update(members).set(updates).where(and(eq(members.id, member.id), sql`${members.points} >= ${LUCKBOX_PRICE}`)).returning({ id: members.id })
      if (!opened.length) return 'Eine Glücksbox kostet 300 persönliche Punkte.'
      return { loot: { id: prize.id, name: prize.name, emoji: prize.emoji, category: prize.category } }
    }
    case 'buy-decor': {
      const price = DECOR_PRICES[id]
      if (price === undefined) return 'Unbekannte Dekoration'
      const updated = await db.update(rooms).set({ teamPoints: sql`${rooms.teamPoints} - ${price}`, ownedDecor: sql`array_append(${rooms.ownedDecor}, ${id})`, decor: id }).where(and(eq(rooms.code, member.roomCode), sql`${rooms.teamPoints} >= ${price}`, sql`NOT (${id} = ANY(${rooms.ownedDecor}))`)).returning({ code: rooms.code })
      if (!updated.length) return 'Nicht genug Teampunkte oder bereits gekauft'; return
    }
    case 'apply-decor': {
      const updated = await db.update(rooms).set({ decor: id }).where(and(eq(rooms.code, member.roomCode), sql`${id} = ANY(${rooms.ownedDecor})`)).returning({ code: rooms.code })
      if (!updated.length) return 'Dekoration gehört dem Raum noch nicht'; return
    }
    case 'buy-item': {
      const item = STORE_ITEMS[id]
      if (!item) return 'Unbekannter Shop-Artikel'
      if (item.category === 'hat' || item.category === 'outfit') {
        const ownedItems = member.customization?.owned ?? []
        if (ownedItems.includes(id)) return 'Bereits freigeschaltet'
        const updated = await db.update(members).set({ points: sql`${members.points} - ${item.price}`, customization: sql`jsonb_set(${members.customization}, '{owned}', coalesce(${members.customization}->'owned', '[]'::jsonb) || to_jsonb(${id}::text))` }).where(and(eq(members.id, member.id), sql`${members.points} >= ${item.price}`)).returning({ id: members.id })
        if (!updated.length) return 'Nicht genug persönliche Punkte'; return
      }
      const [room] = await db.select().from(rooms).where(eq(rooms.code, member.roomCode)).limit(1)
      const ownedRoomItems = room?.customization?.owned ?? []
      if (ownedRoomItems.includes(id)) return 'Bereits freigeschaltet'
      const updated = await db.update(rooms).set({ teamPoints: sql`${rooms.teamPoints} - ${item.price}`, customization: sql`jsonb_set(${rooms.customization}, '{owned}', coalesce(${rooms.customization}->'owned', '[]'::jsonb) || to_jsonb(${id}::text))` }).where(and(eq(rooms.code, member.roomCode), sql`${rooms.teamPoints} >= ${item.price}`)).returning({ code: rooms.code })
      if (!updated.length) return 'Nicht genug Teampunkte'; return
    }
    case 'equip-item': {
      const storeItem = STORE_ITEMS[id]
      const special = SPECIAL_LOOT.find(item => item.id === id && item.category !== 'avatar')
      const item = storeItem ?? special
      if (!item) return 'Unbekannter Artikel'
      const key = item.category
      if (key === 'hat' || key === 'outfit' || key === 'arms' || key === 'wings' || key === 'eyes') {
        const isDefault = id === 'hat_none' || id === 'outfit_hoodie' || id === 'arms_none' || id === 'wings_none' || id === 'eyes_default'
        if (!isDefault && !(member.customization?.owned ?? []).includes(id)) return 'Artikel nicht freigeschaltet'
        await db.update(members).set({ customization: sql`jsonb_set(${members.customization}, ${`{${key}}`}, to_jsonb(${id}::text))` }).where(eq(members.id, member.id)); return
      }
      const [room] = await db.select().from(rooms).where(eq(rooms.code, member.roomCode)).limit(1)
      if (!(room?.customization?.owned ?? []).includes(id)) return 'Artikel nicht freigeschaltet'
      await db.update(rooms).set({ customization: sql`jsonb_set(${rooms.customization}, ${`{${key}}`}, to_jsonb(${id}::text))` }).where(eq(rooms.code, member.roomCode)); return
    }
    case 'focus-start': {
      const minutes = Number(body.minutes)
      if (!FOCUS_MINUTES.includes(minutes)) return 'Ungültige Dauer'
      await db.update(members).set({ focusStartedAt: new Date(), focusMinutes: minutes }).where(eq(members.id, member.id)); return
    }
    case 'focus-cancel': await db.update(members).set({ focusStartedAt: null, focusMinutes: null }).where(eq(members.id, member.id)); return
    case 'focus-complete': {
      if (!member.focusStartedAt || !member.focusMinutes) return 'Keine laufende Fokus-Einheit'
      const minutes = member.focusMinutes
      const elapsed = Date.now() - member.focusStartedAt.getTime()
      if (elapsed < minutes * 60_000 - 5000) return 'Fokus-Einheit noch nicht beendet'
      const claimed = await db.update(members).set({ points: sql`${members.points} + ${REWARDS.personalPerFocus}`, completed: sql`${members.completed} + 1`, focusStartedAt: null, focusMinutes: null }).where(and(eq(members.id, member.id), isNotNull(members.focusStartedAt))).returning({ id: members.id })
      if (!claimed.length) return 'Bereits gutgeschrieben'
      const together = await db.select({ id: members.id }).from(members).where(and(eq(members.roomCode, member.roomCode), ne(members.id, member.id), isNotNull(members.focusStartedAt), gt(members.lastSeen, new Date(Date.now() - ONLINE_WINDOW_MS))))
      const teamGain = REWARDS.teamPerFocus + (together.length ? REWARDS.teamTogetherBonus : 0)
      await db.update(rooms).set({ teamPoints: sql`${rooms.teamPoints} + ${teamGain}` }).where(eq(rooms.code, member.roomCode))
      await db.insert(sessions).values({ memberId: member.id, roomCode: member.roomCode, minutes, points: REWARDS.personalPerFocus })
      return { reward: { personal: REWARDS.personalPerFocus, team: teamGain, together: together.length > 0 } }
    }
    case 'todos': {
      const todos = cleanTodos(body.todos)
      if (!todos) return 'Ungültige Aufgaben'
      await db.update(members).set({ todos }).where(eq(members.id, member.id)); return
    }
    default: return 'Unbekannte Aktion'
  }
}
