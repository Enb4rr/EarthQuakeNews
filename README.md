# EarthQuakeNews

A React Native mobile app that delivers news headlines through physical interaction. Instead of scrolling, users shake their phone to fetch a new batch of headlines filtered by category. Built with Firebase Authentication, the NewsAPI, and the device accelerometer via Expo Sensors.

---

## Features

- Shake-to-refresh news using the device accelerometer
- Category filtering: General, Technology, Sports, Health
- Firebase Authentication (register and login with email/password)
- Live accelerometer debug screen showing X, Y, Z values and shake detection feedback
- Environment-variable-based configuration for all API keys

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native (Expo) |
| Language | TypeScript |
| Auth | Firebase Authentication v8 |
| Navigation | React Navigation (Native Stack + Bottom Tabs) |
| Sensor | expo-sensors (Accelerometer) |
| News Data | NewsAPI v2 |
| Config | react-native-dotenv |

---

## Architecture

### Screen Structure

```
App.tsx
├── Stack.Navigator
│   ├── LoginScreen       - Email/password auth via Firebase
│   ├── RegisterScreen    - Account creation via Firebase
│   └── MainTabs (Bottom Tab Navigator)
│       ├── HomeScreen    - News feed with shake detection
│       └── DebugScreen   - Live accelerometer values
```

### Shake Detection

The shake logic lives in both `HomeScreen.tsx` and `DebugScreen.tsx`. It uses `expo-sensors` to subscribe to the device accelerometer at a set update interval, then calculates the total G-force using the vector magnitude formula:

```
totalForce = sqrt(x² + y² + z²)
```

When `totalForce` exceeds the `SHAKE_THRESHOLD` and enough time has passed since the last shake (cooldown), a new news fetch is triggered. This prevents repeated triggers from a single shake gesture.

```ts
// HomeScreen.tsx
const SHAKE_THRESHOLD = 1.5;  // in G-force units
const SHAKE_COOLDOWN = 1000;  // milliseconds between triggers

const handleShake = ({ value }: { value: XYZ }) => {
  const totalForce = Math.sqrt(value.x ** 2 + value.y ** 2 + value.z ** 2);
  const now = Date.now();
  if (totalForce > SHAKE_THRESHOLD && now - lastShakeTime.current > SHAKE_COOLDOWN) {
    lastShakeTime.current = now;
    fetchNews();
  }
};
```

`lastShakeTime` is stored in a `useRef` rather than `useState` intentionally: updating it should not trigger a re-render, it just needs to persist across renders as mutable state.

### Authentication Flow

Firebase v8 is used for compatibility with the Snack Expo environment. Auth state is not persisted globally via context in this version; after a successful login or register, the navigator resets to the `Main` stack. Logout clears the session and resets navigation back to `Login`.

### Type Definitions

Shared types are declared in `types.ts` to keep the codebase consistent:

```ts
export type XYZ = { x: number; y: number; z: number };

export type Article = {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
};
```

---

## Project Structure

```
EarthQuakeNews/
├── screens/
│   ├── HomeScreen.tsx        - News feed, shake detection, category filters
│   ├── LoginScreen.tsx       - Firebase email/password login
│   ├── RegisterScreen.tsx    - Firebase account registration
│   └── DebugScreen.tsx       - Live accelerometer values and shake feedback
├── navigation/
│   └── MainTabs.tsx          - Bottom tab navigator (Home + Debug)
├── assets/                   - App icons and splash screen
├── App.tsx                   - Root component and stack navigator
├── firebaseConfig.ts         - Firebase initialization using env vars
├── types.ts                  - Shared TypeScript types (XYZ, Article)
├── babel.config.js           - Babel config with react-native-dotenv plugin
├── env.d.ts                  - TypeScript declarations for @env module
├── .env.example              - Template for required environment variables
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- A [NewsAPI](https://newsapi.org/) account (free tier)
- A Firebase project with Email/Password Authentication enabled

### Setup

1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/EarthQuakeNews.git
cd EarthQuakeNews
```

2. Install dependencies

```bash
npm install
```

3. Create your `.env` file from the template

```bash
cp .env.example .env
```

4. Fill in your credentials in `.env`

```
FIREBASE_API_KEY=your_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
NEWS_API_KEY=your_newsapi_key
```

5. Start the development server

```bash
npx expo start
```

Scan the QR code with the Expo Go app on your device.

---

## Design Decisions

**Firebase v8 over v9:** The modular Firebase v9 SDK introduced breaking changes to the import syntax. Firebase v8 (compat mode) was used to maintain compatibility with the Snack Expo environment where the project was initially developed.

**`useRef` for shake timing:** The last shake timestamp is stored in a `useRef` rather than `useState` because updating it does not need to trigger a re-render. Using state for this would cause unnecessary component updates on every accelerometer tick.

**Accelerometer update interval:** Set to `100ms` on HomeScreen and `50ms` on DebugScreen. The debug screen uses a faster interval to give more responsive real-time feedback of the raw values, while the home screen uses a slower interval to reduce battery usage during normal use.

**Shake-first UX:** The app does not auto-load news on mount. The first fetch is triggered by the first shake, which reinforces the core interaction and avoids fetching data the user has not requested yet.

---

## Known Limitations

- NewsAPI free tier blocks requests from browser environments; the app must run on a physical device or emulator
- Auth state is not persisted between app sessions in the current version
- Country filtering is defined but not yet exposed in the UI (planned)

---

## Author

Julian R. - [GitHub](https://github.com/YOUR_USERNAME) - [LinkedIn](https://linkedin.com/in/YOUR_PROFILE)
