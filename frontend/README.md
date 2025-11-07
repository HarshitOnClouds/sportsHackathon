# UK-TalentScout Frontend 🎨

React + Vite frontend for the UK-TalentScout application.

## Features

- ⚡️ **Vite** - Fast build tool and dev server
- ⚛️ **React 19** - Latest React features
- 🎨 **Tailwind CSS** - Utility-first styling
- 📊 **Chart.js** - Performance visualizations
- 🌙 **Dark Mode** - Toggle between themes
- 📱 **Responsive** - Mobile-first design

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Setup

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3001
```

### Development Server

```bash
npm run dev
```

Opens on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable components
├── constants/        # Sports & metrics lists
├── context/          # React Context providers
├── pages/            # Page components
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## Key Dependencies

- **react**: ^19.1.1
- **react-router-dom**: ^6.24.0
- **axios**: ^1.7.2
- **chart.js**: ^4.4.3
- **tailwindcss**: ^4.1.16

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:3001 |

## Learn More

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

For full project documentation, see the main [README.md](../README.md)
