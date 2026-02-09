# CopySnap - AI Copywriting SaaS

CopySnap is a complete, ready-to-deploy AI copywriting platform that generates high-converting content for blogs, social media, emails, product descriptions, and ads.

## Features

- **5 Content Types**: Blog posts, social media, email campaigns, product descriptions, ad copy
- **AI-Powered**: Uses GPT-4o-mini for fast, high-quality content generation
- **Tone Control**: 8 different writing tones (professional, casual, friendly, etc.)
- **User Authentication**: Secure signup/login with JWT tokens
- **Stripe Payments**: Subscription billing with three tiers
- **Usage Limits**: Free (5/day), Pro (100/day), Business (unlimited)
- **Responsive UI**: Beautiful, mobile-friendly design with Tailwind CSS

## Quick Start

```bash
# Run the interactive setup wizard
./setup.sh

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Prerequisites

- Node.js 18+
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))
- Stripe account ([sign up free](https://dashboard.stripe.com/register))

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite via Prisma ORM
- **Auth**: JWT (jose library)
- **Payments**: Stripe Subscriptions
- **AI**: OpenAI GPT-4o-mini
- **Styling**: Tailwind CSS

## Pricing Model

| Plan     | Price    | Generations/Day |
|----------|----------|-----------------|
| Free     | $0       | 5               |
| Pro      | $12/mo   | 100             |
| Business | $29/mo   | Unlimited       |

## Deployment

### Vercel (Recommended for beginners)

1. Push this repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add environment variables from `.env.example`
4. Deploy

> Note: For Vercel, you'll need to switch from SQLite to a hosted database (Vercel Postgres, PlanetScale, etc.)

### VPS / Railway

```bash
npm run build
npm run start
```

Works out of the box with SQLite on any VPS or Railway.

## Stripe Setup

1. Create a Stripe account at [dashboard.stripe.com](https://dashboard.stripe.com)
2. Create two products:
   - **Pro Plan**: $12/month recurring
   - **Business Plan**: $29/month recurring
3. Copy the Price IDs to your `.env` file
4. Set up a webhook pointing to `https://your-domain.com/api/stripe/webhook`
5. Add events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

## License

MIT
