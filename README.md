# Mobile Development 3 Assignment 2

### Made by PG29 Julian R
### Last Updated 4/9/2026

## Features

A React Native mobile app.
Instead of scrolling, users **shake their phone** to receive a new batch of headlines, filtered by category.

Built in SnackExpo, using Firebase Authentication, and NewsAPI.

- Uses the device accelerometer to detect shakes and fetch new headlines
- Filtesr news by General, Technology, Sports, or Health
- Firebase Authentication
- Displays live X, Y, Z values and shake detection feedback on Debug Screen

## Notes

- NewsAPI free tier works on real devices but may be blocked in browser environments
- Shake threshold is set to `1.5G` — adjustable via the `SHAKE_THRESHOLD` constant in both `HomeScreen.tsx` and `DebugScreen.tsx`
- Had to use Firebase v8 for compatibility with SnackExpo
- I will further implement filters by country as well