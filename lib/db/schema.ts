import { integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export type Todo = { id: number; text: string; done: boolean }

export const rooms = pgTable('jl_rooms', {
  code: text('code').primaryKey(),
  teamPoints: integer('team_points').notNull().default(0),
  decor: text('decor'),
  ownedDecor: text('owned_decor').array().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const members = pgTable('jl_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  tokenHash: text('token_hash').notNull().unique(),
  roomCode: text('room_code').notNull(),
  name: text('name').notNull(),
  points: integer('points').notNull().default(0),
  completed: integer('completed').notNull().default(0),
  avatar: text('avatar').notNull().default('fox'),
  ownedAvatars: text('owned_avatars').array().notNull().default(['fox']),
  todos: jsonb('todos').$type<Todo[]>().notNull().default([]),
  focusStartedAt: timestamp('focus_started_at', { withTimezone: true }),
  focusMinutes: integer('focus_minutes'),
  lastSeen: timestamp('last_seen', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Member = typeof members.$inferSelect
export type Room = typeof rooms.$inferSelect
