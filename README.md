# Quran App

A modern, beautiful, and ad-free Quran reading experience built with Next.js.

## Features

- **Browse Surahs** - All 114 surahs with Arabic and English names
- **Beautiful Arabic Typography** - Optimized Scheherazade New font for clear Quranic text
- **Daily Athkar** - Morning, evening, and sleep remembrances with tap-to-count tracking
- **Continue Reading** - Automatically remembers your last reading position
- **Customizable Reading** - Adjustable font sizes and multiple reading modes (continuous flow or book spread)
- **Command Palette** - Quick search and navigation with keyboard shortcuts
- **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- **Ad-Free** - Clean, distraction-free reading experience

## Tech Stack

- [Next.js 13](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Headless UI](https://headlessui.com/) - Accessible UI components
- [Quran.com API](https://quran.api-docs.io/) - Quran data

## Getting Started

### Prerequisites

- Node.js 24.x
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/quranapp.git
   cd quranapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── [surah]/         # Dynamic surah reading page
│   ├── athkar/          # Daily athkar page
│   ├── bypage/          # Quran by-page reading
│   └── about/           # About page
├── components/          # React components
├── context/             # React context providers
├── lib/                 # Data and utilities
└── public/              # Static assets
```

## Author

**Awab Elkhalil** - [awab.design](https://awab.design)

## License

This project is open source and available under the [MIT License](LICENSE).
