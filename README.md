# Meditation App

A light, spiritual meditation app built with Next.js 15, React 19, TypeScript, Tailwind v4, and shadcn/ui. Follows feature-sliced design (FSD).

## Tech

- Next.js 15 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- shadcn/ui (new-york style)

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – start production server
- `npm run lint` – lint

## Structure (FSD)

```
src/
  app/                # routes, layouts, pages
  entities/           # core domain models
    meditation/
      model/
  features/           # feature units (UI + logic)
    daily-meditation/
      ui/
  shared/             # shared ui, lib, hooks
    ui/               # shadcn/ui components live here
    lib/
  widgets/            # composite UI sections
    header/
      ui/
```

## Routes

- `/` – Landing
- `/meditation-of-the-day` – Daily practice
- `/topics` – Topic index
- `/topics/[slug]` – Topic detail
- `/help` – Tips & FAQ

## Notes

- Tailwind v4 uses `@import "tailwindcss"` and `@theme inline` in `src/app/globals.css`.
- shadcn components are installed into `src/shared/ui` and can be imported like `@/shared/ui/button`.
