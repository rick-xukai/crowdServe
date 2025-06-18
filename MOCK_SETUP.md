# CrowdServe Frontend Mock Setup

This document explains how to use the mock data system for the CrowdServe frontend application.

## Overview

The mock system uses MSW (Mock Service Worker) to intercept API calls and return realistic mock data. This allows the frontend to run completely independently without requiring the backend server.

## Setup Instructions

1. **Install Dependencies** (already done):
   ```bash
   npm install msw@1.3.2
   ```

2. **Initialize MSW** (already done):
   ```bash
   npx msw init public/ --save
   ```

3. **Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_SERVER=http://localhost:3000
   NODE_ENV=development
   ```

4. **Start the Application**:
   ```bash
   npm run dev
   ```

## Authentication System

### Fixed Demo Account
The mock system uses a fixed demo account for testing:

**Email Login:**
- Email: `demo@crowdserve.com`
- Password: `password123`

**Google Login:**
- Any Google authentication will automatically log you in as the demo user
- No actual Google account required - the mock system simulates successful Google login

**Admin/Scanner Login:**
- Email: `admin@crowdserve.com`
- Password: `admin123`

### Authentication Features

#### 1. Email/Password Login
- **Endpoint**: `POST /api/v1/user/session`
- **Valid Credentials**: `demo@crowdserve.com` / `password123`
- **Error Handling**:
  - Wrong email: Returns code 1001 (account needs activation)
  - Wrong password: Returns code 401 (invalid credentials)
  - Missing fields: Returns code 400 (validation error)

#### 2. Google Login
- **Endpoint**: `POST /api/v1/user/session`
- **Payload**: `{ externalChannel: 'google', externalId: 'google_token' }`
- **Behavior**: Always succeeds and logs in as demo user
- **Integration**: Works with the GoogleAuthComponent

#### 3. User Registration
- **Endpoint**: `POST /api/v1/user`
- **Email Registration**: Requires verification code `123456`
- **Google Registration**: Always succeeds
- **Validation**: 
  - Email `demo@crowdserve.com` returns "already exists" error
  - Other emails succeed with verification code

#### 4. Forgot Password Flow
- **Send Reset Code**: `DELETE /api/v1/user/password`
  - Only works for `demo@crowdserve.com`
  - Returns reset code `123456` in development mode
- **Reset Password**: `PUT /api/v1/user/password`
  - Requires email, code (`123456`), and new password

#### 5. Verification System
- **Send Verification Code**: `POST /api/v1/user/verification`
  - Always returns success with code `123456`
  - Shows actual code in development mode
- **Verify User**: `POST /api/v1/user/status/verify`
  - Always succeeds for any email

#### 6. User Profile
- **Get Profile**: `GET /api/v1/user`
  - Requires Authorization header
  - Returns demo user profile
- **Update Profile**: `PUT /api/v1/user`
  - Requires Authorization header
  - Always succeeds

### Testing Different Scenarios

#### Successful Login
```javascript
// Email login
{
  email: "demo@crowdserve.com",
  password: "password123",
  externalChannel: "email"
}

// Google login
{
  email: "demo@crowdserve.com",
  externalChannel: "google",
  externalId: "mock_google_token"
}
```

#### Error Scenarios
```javascript
// Account not found (triggers activation flow)
{
  email: "nonexistent@example.com",
  password: "anypassword",
  externalChannel: "email"
}

// Wrong password
{
  email: "demo@crowdserve.com",
  password: "wrongpassword",
  externalChannel: "email"
}
```

## Mock Data Structure

### Events
- **10 different events** with unique details
- **Event slugs** in format: `event-name-randomString`
- **Ticket types** vary by event (1-2 types per event)
- **Rave integration** for select events

### Tickets & Collectibles
- **My Tickets**: Shows purchased tickets for demo user
- **QR Codes**: Generated for each ticket
- **Transfer System**: Mock transfer codes and claiming

### Raves (Social Features)
- **4 different raves** corresponding to different events
- **Flame Points**: User has 85 points
- **Leaderboards**: Mock user rankings
- **Rewards**: Redeemable items with flame points
- **Tasks**: Various engagement activities

### Crowdfunding
- **Multiple campaigns** with different funding goals
- **Progress tracking** and backer information
- **Reward tiers** for different contribution levels

### Scanner (Admin Features)
- **Event verification** for staff
- **Ticket redemption** system
- **Admin dashboard** functionality

## Development Tips

### Debugging Authentication
1. **Check Network Tab**: All API calls should show 200 status
2. **Console Logs**: MSW logs intercepted requests
3. **Verification Codes**: Always use `123456` for any verification
4. **Token Storage**: Tokens are stored in cookies automatically

### Common Issues
1. **Service Worker Not Found**: Run `npx msw init public/ --save`
2. **CORS Errors**: Ensure `NEXT_PUBLIC_API_SERVER` is set correctly
3. **Login Loops**: Clear cookies and localStorage if stuck

### Customizing Mock Data
- **User Data**: Edit `mockUser` in `mocks/handlers/auth.ts`
- **Events**: Modify arrays in `mocks/handlers/events.ts`
- **Credentials**: Change `DEMO_EMAIL` and `DEMO_PASSWORD` constants

## API Coverage

The mock system covers all major API endpoints:

### Authentication
- ✅ Login (email + Google)
- ✅ Registration
- ✅ Forgot password
- ✅ Password reset
- ✅ User verification
- ✅ Profile management
- ✅ Scanner login

### Events & Tickets
- ✅ Event listings
- ✅ Event details
- ✅ Ticket types
- ✅ My tickets
- ✅ QR codes
- ✅ Transfers

### Social Features
- ✅ Raves
- ✅ Leaderboards
- ✅ Rewards
- ✅ Social sharing

### Other Features
- ✅ Crowdfunding
- ✅ Scanner functionality
- ✅ Profile management
- ✅ Market data

## Quick Start Guide

1. **Login**: Use `demo@crowdserve.com` / `password123`
2. **Browse Events**: All 10 events are available with realistic data
3. **Check Tickets**: View your mock purchased tickets
4. **Try Raves**: Engage with social features and earn flame points
5. **Admin Access**: Use `admin@crowdserve.com` / `admin123` for scanner features

The mock system provides a complete, realistic experience of the CrowdServe platform without requiring any backend infrastructure. 