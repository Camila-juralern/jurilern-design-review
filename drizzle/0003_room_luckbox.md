# JuriLern: Luck-box room rewards

Room rewards (graduation diploma and the space, moon, sun, castle, and aurora classroom scenes) are exclusive prizes from the 300-personal-point luck box. When a room reward is drawn, it is added to the shared room inventory. The prize can then be equipped by a room member.

The API stores room inventory in the existing `jl_rooms.customization` JSONB column. Existing databases already have that column from migration `0002_jurilern_gameplay.sql`; no additional database migration is needed for these JSON keys.

The `public/luckbox.html` page uses the existing authenticated `/api/jl/state` and `/api/jl/action` endpoints. It can be opened at `/luckbox.html` after joining the JuriLern room.
