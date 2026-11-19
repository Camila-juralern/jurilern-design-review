import { integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export type Todo = { id: number; text: string; done: boolean }
export type MemberCustomization = { owned: string[]; hat: string; outfit: string; arms?: string; wings?: string }
export type RoomCustomization = { owned: string[]; wall: string; floor: string }

export const rooms = pgTable('jl_rooms', {
  code: text('code').primaryKey(),
  teamPoints: integer('team_points').notNull().default(0),
  decor: text('decor'),
  ownedDecor: text('owned_decor').array().notNull().default([]),
  customization: jsonb('customization').$type<RoomCustomization>().notNull().default({ owned: [], wall: 'indigo', floor: 'oak' }),
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
  customization: jsonb('customization').$type<MemberCustomization>().notNull().default({ owned: [], hat: 'none', outfit: 'hoodie' }),
  todos: jsonb('todos').$type<Todo[]>().notNull().default([]),
  focusStartedAt: timestamp('focus_started_at', { withTimezone: true }),
  focusMinutes: integer('focus_minutes'),
  lastSeen: timestamp('last_seen', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const sessions = pgTable('jl_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  memberId: uuid('member_id').notNull(),
  roomCode: text('room_code').notNull(),
  minutes: integer('minutes').notNull(),
  points: integer('points').notNull().default(25),
  completedAt: timestamp('completed_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Member = typeof members.$inferSelect
export type Room = typeof rooms.$inferSelect
export type Session = typeof sessions.$inferSelect
