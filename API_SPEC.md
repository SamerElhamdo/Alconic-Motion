# Alconic Motion — Backend API & Database Schema

> هذا المستند يوثّق متطلبات الباك اند فقط. لا كود هنا — فقط الاندبوينتات وهيكل قاعدة البيانات.

---

## قاعدة البيانات (PostgreSQL)

### جداول أساسية

#### `users`
```
id            uuid PK
email         text UNIQUE NOT NULL
name          text
avatar_url    text
plan          enum('free','pro','studio') DEFAULT 'free'
credits       integer DEFAULT 200
created_at    timestamptz
```

#### `projects`
```
id            uuid PK
user_id       uuid FK → users.id
title         text
prompt        text
neg_prompt    text
style         text
aspect_ratio  text   -- '16:9' | '9:16' | '1:1'
resolution    text   -- '720p' | '1080p' | '4k'
duration_sec  integer
model_id      text   -- FK → models.id
status        enum('idle','directing','storyboard','generating','rendering','done','failed')
credits_used  integer
created_at    timestamptz
updated_at    timestamptz
```

#### `project_versions`
```
id            uuid PK
project_id    uuid FK → projects.id
version_num   integer
output_url    text
thumbnail_url text
created_at    timestamptz
```

#### `scenes`
```
id            uuid PK
project_id    uuid FK → projects.id
version_id    uuid FK → project_versions.id
scene_num     integer
timecode_start text   -- '0s'
description   text
frame_url     text
```

#### `agent_logs`
```
id            uuid PK
project_id    uuid FK → projects.id
agent_name    text  -- 'Story'|'Motion'|'Assets'|'Audio'|'Vision'|'QC'|'Render'
status        enum('wait','work','done','fail')
progress_pct  integer
output_text   text
duration_ms   integer
started_at    timestamptz
finished_at   timestamptz
```

#### `assets`
```
id            uuid PK
user_id       uuid FK → users.id
project_id    uuid FK → projects.id (nullable — standalone upload)
type          enum('video','image','audio')
title         text
url           text NOT NULL
thumbnail_url text
duration_sec  integer
resolution    text
file_size_kb  integer
prompt        text
model_id      text
credits_spent integer
created_at    timestamptz
```

#### `models`
```
id            text PK   -- 'seedance-2.5'
name          text
description   text
max_res       text
max_duration  integer   -- seconds
credits_per_sec decimal
is_locked     boolean   -- requires Pro/Studio plan
plan_required enum('free','pro','studio')
```

#### `templates`
```
id            uuid PK
name          text
category      text
duration_sec  integer
aspect_ratio  text
preview_url   text
fields        jsonb     -- [{key, label, placeholder}]
cost_estimate integer
```

#### `transactions`
```
id            uuid PK
user_id       uuid FK → users.id
type          enum('usage','topup','refund')
description   text
credits_delta integer   -- negative for usage, positive for topup
balance_after integer
project_id    uuid FK → projects.id (nullable)
created_at    timestamptz
```

#### `brand_kits`
```
id            uuid PK
user_id       uuid FK → users.id
name          text DEFAULT 'Default'
logo_url      text
colors        jsonb   -- string[]
fonts         jsonb   -- {heading, body}
style_preset  text
created_at    timestamptz
```

#### `api_keys`
```
id            uuid PK
user_id       uuid FK → users.id
label         text
key_hash      text NOT NULL  -- bcrypt hash, NEVER store plain
prefix        text           -- first 8 chars for display
created_at    timestamptz
last_used_at  timestamptz
revoked_at    timestamptz
```

#### `team_members`
```
id            uuid PK
org_id        uuid FK → users.id  -- the owner account
user_id       uuid FK → users.id
role          enum('owner','editor','viewer')
invited_email text   -- before they accept
accepted_at   timestamptz
created_at    timestamptz
```

---

## Endpoints

Base: `https://api.alconic.motion/v1`
Auth: `Authorization: Bearer <jwt>`

---

### Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/signup` | إنشاء حساب جديد |
| POST | `/auth/login` | تسجيل دخول → `{token, user}` |
| POST | `/auth/logout` | إلغاء الجلسة |
| POST | `/auth/refresh` | تجديد JWT |
| POST | `/auth/forgot-password` | طلب إعادة تعيين كلمة المرور |
| POST | `/auth/reset-password` | تعيين كلمة مرور جديدة |

---

### Users / Profile

| Method | Path | Description |
|--------|------|-------------|
| GET  | `/me` | بيانات المستخدم الحالي + رصيد |
| PATCH| `/me` | تحديث الاسم وال avatar |
| PATCH| `/me/password` | تغيير كلمة المرور |

---

### Projects

| Method | Path | Description |
|--------|------|-------------|
| GET    | `/projects` | قائمة مشاريع المستخدم (pagination) |
| POST   | `/projects` | إنشاء مشروع جديد |
| GET    | `/projects/:id` | تفاصيل المشروع + agents + current version |
| PATCH  | `/projects/:id` | تحديث prompt/settings |
| DELETE | `/projects/:id` | حذف المشروع |
| GET    | `/projects/:id/versions` | قائمة الإصدارات |
| POST   | `/projects/:id/direct` | **بدء pipeline الـ 7 agents** |
| POST   | `/projects/:id/approve-storyboard` | تأكيد الـ storyboard → يبدأ الـ generating |
| POST   | `/projects/:id/approve-preview`    | تأكيد المعاينة → يبدأ الـ render |
| POST   | `/projects/:id/retry` | إعادة محاولة agent فاشل |
| GET    | `/projects/:id/agent-status` | حالة كل agent (polling أو WebSocket) |
| GET    | `/projects/:id/export` | رابط تنزيل بصيغة وجودة محددة `?format=mp4&res=1080p` |

#### WebSocket
```
WS /projects/:id/stream
→ events: { agent, status, pct, message }
```

---

### Scenes

| Method | Path | Description |
|--------|------|-------------|
| GET  | `/projects/:id/scenes` | مشاهد الـ storyboard |
| PATCH| `/projects/:id/scenes/:sceneId` | تعديل وصف مشهد |

---

### Assets / Library

| Method | Path | Description |
|--------|------|-------------|
| GET    | `/assets` | المكتبة مع فلاتر `?type=video&q=whale&sort=date` |
| POST   | `/assets/upload` | رفع ملف (multipart) |
| GET    | `/assets/:id` | تفاصيل asset |
| PATCH  | `/assets/:id` | rename |
| DELETE | `/assets/:id` | حذف |
| POST   | `/assets/batch-delete` | حذف متعدد `{ids:[]}` |
| GET    | `/assets/:id/download-url` | signed URL للتنزيل |

---

### Templates

| Method | Path | Description |
|--------|------|-------------|
| GET  | `/templates` | قائمة القوالب مع فلاتر `?category=product` |
| GET  | `/templates/:id` | تفاصيل قالب |
| POST | `/projects` | (نفس endpoint المشاريع) مع `template_id` في الـ body |

---

### Models

| Method | Path | Description |
|--------|------|-------------|
| GET  | `/models` | قائمة النماذج المتاحة للمستخدم حسب الخطة |
| GET  | `/models/:id` | تفاصيل نموذج |

---

### Billing & Credits

| Method | Path | Description |
|--------|------|-------------|
| GET    | `/billing/balance` | الرصيد الحالي |
| GET    | `/billing/usage` | استهلاك N يوم الأخيرة `?days=30` |
| GET    | `/billing/transactions` | سجل المعاملات (pagination) |
| GET    | `/billing/plans` | قائمة الخطط والأسعار |
| POST   | `/billing/subscribe` | الاشتراك أو تغيير الخطة `{plan}` |
| POST   | `/billing/topup` | شراء رصيد `{pack_id}` → payment intent |
| POST   | `/billing/webhook` | Stripe webhook (internal) |

---

### Brand Kit

| Method | Path | Description |
|--------|------|-------------|
| GET    | `/brand-kit` | kit المستخدم الحالي |
| PATCH  | `/brand-kit` | تحديث الألوان والشعار والخطوط |
| POST   | `/brand-kit/logo` | رفع شعار (multipart) |

---

### Settings

| Method | Path | Description |
|--------|------|-------------|
| GET    | `/settings` | إعدادات المستخدم (defaults, notifications) |
| PATCH  | `/settings` | تحديث الإعدادات |

---

### API Keys

| Method | Path | Description |
|--------|------|-------------|
| GET    | `/api-keys` | قائمة مفاتيح المستخدم (prefix فقط) |
| POST   | `/api-keys` | إنشاء مفتاح جديد → يُعاد مرة واحدة |
| DELETE | `/api-keys/:id` | إلغاء مفتاح |

---

### Team

| Method | Path | Description |
|--------|------|-------------|
| GET    | `/team` | أعضاء الفريق |
| POST   | `/team/invite` | دعوة بالإيميل `{email, role}` |
| PATCH  | `/team/:memberId` | تغيير الدور |
| DELETE | `/team/:memberId` | إزالة عضو |
| POST   | `/team/accept/:token` | قبول دعوة |

---

## ملاحظات التكامل

- **Generation pipeline**: بعد `POST /projects/:id/direct` يبدأ الباك اند بتشغيل الـ 7 agents تسلسلياً عبر job queue (Bull/BullMQ). الـ frontend يتابع الحالة عبر WebSocket أو polling كل 2 ثانية.
- **Credits**: يُخصم الرصيد بعد نجاح الـ Render agent فقط. إذا فشل agent → لا خصم.
- **Storage**: ملفات الفيديو على S3/R2، الروابط signed بـ 24h TTL.
- **Rate limiting**: الـ generation endpoints بـ 5 req/min per user.
