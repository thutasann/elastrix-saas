# Elastrix SAAS

This is the Web Builder and Project Management SAAS.

![demo](./public/assets/preview.png)

## Tech Stacks

- Nextjs
- Clerk
- Prisma
- PlanetScale
- MySql
- Stripe
- Shadcn UI
- Uploadthings
- Zod

## Scripts

### ERD Generator

- https://prisma-erd.simonknott.de/

### Prisma init

```bash
npx prisma init --datasource-provider mysql
```

### Prisma Generate

```bash
npx prisma generate
```

### Prisma Format

```bash
npx prisma format
```

### Prisma Studio

```bash
npx prisma studio
```

## Platnet Scale

### Run Database Locally

```bash
pscale connect elastrix main --port 3309
```

### Shell

```bash
pscale shell elastrix main
```

```bash
pscale branch promote elastrix main
```
