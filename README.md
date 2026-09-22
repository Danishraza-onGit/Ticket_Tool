# Cygnus Ticket Tool — Mobile Application

Mobile application for the **Cygnus Ticketing Tool**, developed using React Native, Expo, Expo Router, and TypeScript.

The application is being developed as the mobile interface for the existing Cygnus ticket management system, with support for both Android and iOS.

## Current Status

The Admin-side mobile interface and core navigation flows are currently implemented as a working prototype.

The project is structured to support the next development phase: **integration with the existing backend APIs and replacement of temporary development data with live application data**.

## Tech Stack

- React Native 0.86
- React 19
- Expo SDK 57
- Expo Router
- TypeScript
- React Native Gifted Charts
- React Native SVG
- Expo Linear Gradient

## Implemented Modules

The current Admin application includes:

- Login interface
- Dashboard
- Ticket search and filtering
- New Ticket flow
- My Tickets
- Overdue Tickets
- Projects
- New Project flow
- Employees and Account Managers
- Customers
- Activity Log
- Inward / Outward
- Pending Requests
- Routine Check
- Analytics
- Account / Profile
- Shared ticket-detail navigation

### Analytics

The mobile Analytics module currently includes Ticket and Project analytics with visualizations for:

- Ticket / Project volume
- Call types
- Employees
- Account Managers
- Priority
- Status
- Ticket mode
- Internal vs External tickets

The Analytics interface currently uses typed temporary data for UI validation and is prepared for future API-backed data.

## Project Structure

```text
app/          Application routes and screens
components/   Reusable UI and feature components
constants/    Shared constants and configuration
data/         Temporary development data
hooks/        Reusable React hooks
types/        Shared TypeScript models
assets/       Application assets
```

The project follows Expo Router's file-based routing system.

UI components are kept separate from temporary data and future API integration logic to make the transition to backend-driven data easier to maintain.

## Installation

Install project dependencies:

```bash
npm install
```

## Running the Application

Start the Expo development server:

```bash
npx expo start
```

### iOS

```bash
npm run ios
```

### Android

```bash
npm run android
```

Because the project uses native dependencies such as `react-native-svg` and `react-native-gifted-charts`, a development/native build may be required when native dependencies change.

## Available Scripts

```bash
npm start
npm run ios
npm run android
npm run web
npm run lint
```

## Development Notes

- Temporary data is currently used in areas where backend APIs have not yet been integrated.
- API endpoints, authentication behavior, permissions, and backend response structures should follow the actual backend contract once provided.
- Native `ios/` and `android/` build directories are generated locally and are not tracked in this repository.
- Environment-specific credentials and secrets should not be committed to the repository.

## Next Phase

The next development phase is backend/API integration. Existing temporary data will be replaced incrementally as the corresponding APIs are integrated and validated.

---

**Cygnus Ticketing Tool — Mobile Application**