# Elastrix

This is the Web Builder and Project Management SAAS.

![demo](./public/assets/preview.png)

## Tech Stacks

- Nextjs
- Clerk
- Prisma
- MongoDB
- Stripe
- Shadcn UI
- Uploadthings
- Zod

## Scripts

### ERD Generator

- https://prisma-erd.simonknott.de/

### Prisma init

```bash
npx prisma init --datasource-provider mongodb
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

### Prisma DB Push

```bash
npx prisma db push
```

## Stirpe

- https://docs.stripe.com/connect/testing#using-oauth

### Stripe Webhook

```bash
stripe login
```

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Test Trigger Webhook

```bash
stripe trigger payment_intent.succeeded
```
