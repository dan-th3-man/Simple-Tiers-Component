# Simple Tiers Component
A React component for displaying user progression through different tiers based on points. Built with Next.js, Tailwind CSS, and shadcn/ui.

## Features
- 🎯 Configurable tier levels
- 📊 Visual progress tracking
- 🌓 Dark/Light mode support
- 🔐 Wallet authentication via Privy
- 📱 Responsive design

## Installation

```
npm install
```

## Environment Variables
Create a .env.local file in the root directory:
```
OPENFORMAT_API_KEY=your_openformat_api_key_here
OPENFORMAT_APP_ID=your_openformat_app_id_here
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
```

## Deploy
Instantly deploy your own copy of the template using Vercel or Netlify:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdan-th3-man%2Fsimple-tiers-comp&env=OPENFORMAT_API_KEY,OPENFORMAT_DAPP_ID,NEXT_PUBLIC_PRIVY_APP_ID) [![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/dan-th3-man/simple-tiers-comp)

## Usage
1. Start the development server:
```
npm run dev
```

2. Open http://localhost:3000 in your browser.

## Tier Configuration
The tiers are configured in the `components/tier-progression.tsx` file using the following structure:
```
const tiers = [
  {
    name: "Amateur",
    pointsRequired: 1000,
    color: "bg-orange-500"
  },
  {
    name: "Pro",
    pointsRequired: 2500,
    color: "bg-green-500"
  },
  {
    name: "Expert",
    pointsRequired: 5000,
    color: "bg-sky-500"
  },
  {
    name: "Legend",
    pointsRequired: 10000,
    color: "bg-pink-500"
  }
]
``` 

## Tech Stack
- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- Privy Authentication
- next-themes