# CopySnap - AI Copywriting SaaS

CopySnap is a complete, ready-to-deploy AI copywriting platform that generates high-converting content for blogs, social media, emails, product descriptions, and ads.

## Features

- **5 Content Types**: Blog posts, social media, email campaigns, product descriptions, ad copy
- **AI-Powered**: Uses GPT-4o-mini for fast, high-quality content generation
- **Tone Control**: 8 different writing tones (professional, casual, friendly, etc.)
- **User Authentication**: Secure signup/login with JWT tokens
- **YooKassa Payments**: Subscription billing with three tiers (works in Russia)
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
- YooKassa account ([sign up here](https://yookassa.ru))

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite via Prisma ORM
- **Auth**: JWT (jose library)
- **Payments**: YooKassa (30-day plans)
- **AI**: OpenAI GPT-4o-mini
- **Styling**: Tailwind CSS

## Pricing Model

| Plan     | Price        | Generations/Day |
|----------|-------------|-----------------|
| Free     | 0 RUB       | 5               |
| Pro      | 990 RUB/mo  | 100             |
| Business | 2490 RUB/mo | Unlimited       |

## Deployment

### VPS (Recommended)

```bash
npm run build
npm run start
```

Works out of the box with SQLite on any VPS or Railway.

### Railway

1. Push this repo to GitHub
2. Create a project on [railway.app](https://railway.app)
3. Add environment variables from `.env.example`
4. Railway will auto-deploy

## YooKassa Setup

1. Register at [yookassa.ru](https://yookassa.ru)
2. Get your **Shop ID** and **Secret Key** from shop settings
3. Add them to your `.env` file
4. Set up a webhook pointing to `https://your-domain.com/api/payment/webhook`
5. Select event: `payment.succeeded`

## License

MIT
