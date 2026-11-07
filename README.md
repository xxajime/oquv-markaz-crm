# O'quv Markaz CRM

**Open-source CRM for education centers in Uzbekistan** — leads, groups, attendance, payments, teachers, salaries and reports in one place, with a Uzbek-language interface and Telegram integration.

> 🇺🇿 [O'zbekcha qisqacha ma'lumot pastda](#-ozbekcha)

Most private education centers in Uzbekistan (IT, language and exam-prep schools) still run on Excel sheets, paper journals and Telegram chats. Existing CRMs are either foreign products without Uzbek language and local payment habits, or closed paid SaaS. This project is a free, self-hostable alternative built for how local centers actually work.

It started as an internal system built for and deployed at a real IT academy in Uzbekistan, with separate panels for administrators, receptionists, teachers, students and accountants.

## Features

**Sales & leads**
- Lead pipeline with drag-and-drop stages (new → contacted → trial → enrolled / lost)
- Lead sources (Instagram, Telegram, TikTok, referral, walk-in…), tags, activity history
- Public application form (`/apply`) that creates leads automatically
- Reminders and tasks for operators; daily follow-up cron jobs
- Excel import / export

**Teaching**
- Courses, groups, time slots, timetable and holidays
- Attendance for students and staff
- Exams, scores, exercises, homework submissions
- Student coins/bonuses and leaderboard

**Finance**
- Payments with configurable payment types and printable receipts
- Debtors list
- Expenses, incomes, cash flow and financial reports
- Teacher payroll / salary records

**Portals & roles**
- Separate panels: admin dashboard, teacher, student, reception, finance
- Roles: Super Admin, Admin, Manager, Operator, Mentor, Reception, Accountant
- Granular per-module permissions and audit log

**Integrations**
- Telegram bot (notifications, quick lead entry, student profile Mini App)
- SMS via Eskiz.uz
- Branding from settings (center name and logo), dark mode, PWA manifest

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Prisma 7 · PostgreSQL · NextAuth v5 · Tailwind CSS · Recharts

## Quick start

Requirements: Node.js 20+, PostgreSQL 14+ (local or [Supabase](https://supabase.com)).

```bash
git clone https://github.com/xxajime/oquv-markaz-crm.git
cd oquv-markaz-crm
cp .env.example .env        # fill DATABASE_URL and NEXTAUTH_SECRET
npm install
npm run db:push             # create tables
npm run db:seed             # demo data + default admin
npm run dev                 # http://localhost:3000
```

The seed prints a random password for the `admin` user (or set `SEED_ADMIN_PASSWORD` in `.env`). **Change it right after the first login.**

### Configuration

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `DIRECT_URL` | Optional direct connection for `prisma db push` (Supabase) |
| `NEXTAUTH_URL`, `NEXTAUTH_SECRET` | Auth settings |
| `NEXT_PUBLIC_APP_NAME` | Default center name shown in the UI |
| `NEXT_PUBLIC_APP_URL` | Public URL of the deployment |
| `TELEGRAM_BOT_TOKEN` | Optional, can also be set in Settings |
| `CRON_SECRET` | Protects `/api/cron/*` endpoints |

Center name, logo, Telegram bot and SMS credentials can be changed at runtime in **Settings**.

### Deploy

Works on Vercel out of the box (`vercel.json` includes the cron schedule). Add the environment variables above in the project settings and deploy.

## Roadmap

- [ ] English and Russian interface translations
- [ ] Docker Compose setup for one-command self-hosting
- [ ] Click / Payme online payment integration
- [ ] Automated tests and CI
- [ ] Multi-branch (filial) support

## Contributing

Issues and pull requests are welcome. Look for issues labeled `good first issue` to get started. Please open an issue before large changes.

## License

[MIT](LICENSE)

---

## 🇺🇿 O'zbekcha

**O'quv Markaz CRM** — O'zbekistondagi o'quv markazlar uchun bepul, ochiq kodli boshqaruv tizimi: lidlar, guruhlar, davomat, to'lovlar, qarzdorlar, o'qituvchilar maoshi, hisobotlar va Telegram bot.

O'rnatish uchun yuqoridagi **Quick start** bo'limidagi buyruqlarni bajaring. Savol va takliflar uchun Issue oching — o'zbek tilida yozishingiz mumkin.
