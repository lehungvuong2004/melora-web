MELORA — Vietnamese Music Streaming Platform

A modern Vietnamese music streaming platform built with ReactJS and Laravel REST API.

1. Project Overview

MELORA is a modern music streaming platform focused on Vietnamese users.

The platform allows users to:

Discover music
Search songs, artists, albums and playlists
Stream music
View lyrics
Like songs
Follow artists
Create playlists
Follow playlists
View listening history
View recently played songs
Subscribe to Premium / Family plans
Make payments
Receive notifications
Report songs, artists and playlists

The system also provides administration features for managing:

Users
Roles
Artists
Albums
Songs
Genres
Playlists
Reports
Subscriptions
Payments
Notifications
2. Technology Stack
Frontend
Nextjs
TypeScript
Vite
React Router
Axios
Tailwind CSS
Redux Toolkit
Formik
Yup
ECharts
Iconify
Backend
PHP
Laravel
Laravel REST API
Laravel Eloquent ORM
Laravel Validation
Laravel Authentication
Laravel Authorization
Database
MySQL 8.x
UTF8MB4
3NF normalized database
Development
Git
GitHub
Docker
Docker Compose
Postman
3. Architecture

The project uses a separated frontend/backend architecture.

                    ┌─────────────────────┐
                    │      ReactJS        │
                    │     Frontend        │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │       Laravel       │
                    │       Backend       │
                    │       REST API      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       MySQL 8       │
                    │     melora_db       │
                    └─────────────────────┘

5. Development Rules
IMPORTANT

AI agents MUST follow these rules.

Rule 1 — Do not change database structure without permission

The existing database schema is the source of truth.

Do NOT:

Rename tables
Rename columns
Delete columns
Add unnecessary tables
Remove relationships
Change ENUM values
Change primary keys
Change foreign keys

unless explicitly requested.

Rule 2 — Do not hardcode fake data inside React components

Bad:

const songs = [
  {
    id: 1,
    title: "Song A"
  }
];

Preferred:

const { data } = await songApi.getSongs();

Use API services and typed interfaces.

Rule 3 — API-first development

Every dynamic UI feature must have a corresponding API.

Example:

React
 ↓
Axios
 ↓
Laravel API
 ↓
Controller
 ↓
Service
 ↓
Eloquent Model
 ↓
MySQL
Rule 4 — TypeScript must be strongly typed

Avoid:

const data: any = ...

Prefer:

interface Song {
  id: number;
  title: string;
  audio_url: string;
  duration_seconds: number;
}
Rule 5 — Reusable components

Do not duplicate UI code.

Create reusable components such as:

SongCard
ArtistCard
AlbumCard
PlaylistCard
MusicPlayer
SearchBar
Modal
Dropdown
Pagination
Loading
EmptyState
ErrorState
6. User Roles

The system contains three main roles.

ADMIN
USER
ARTIST
ADMIN

Can:

Manage users
Manage roles
Manage artists
Manage albums
Manage songs
Manage genres
Manage reports
Manage subscriptions
Manage payments
Manage notifications
View dashboard statistics
USER

Can:

Browse music
Search
Play music
Like songs
Follow artists
Create playlists
Follow playlists
View history
Subscribe to Premium
Make payments
Report content
ARTIST

Can:

Manage artist profile
Manage albums
Manage songs
Upload music
Update lyrics
View song statistics
View listener statistics
7. Authentication

Authentication must be implemented through Laravel API.

Required features:

Register
Login
Logout
Refresh authentication
Get current user
Forgot password
Reset password
Email verification

Frontend stores authentication state securely.

Protected routes must require authentication.

Example:

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password
8. Main Features
8.1 Home

Display:

Featured songs
Trending songs
New releases
Popular artists
Popular albums
Recommended playlists
8.2 Music Search

Users can search:

Song
Artist
Album
Playlist

Search should support:

Keyword
Pagination
Sorting
Filtering
8.3 Song

Song detail must display:

Title
Artist
Album
Cover
Duration
Lyrics
Release date
Play count
Like status

Actions:

Play
Like
Add to playlist
Share
Report
8.4 Music Player

Create a global music player.

Requirements:

Play
Pause
Previous
Next
Seek
Volume
Progress
Duration
Queue
Repeat
Shuffle
Current song
Mini player
Full player

The player must remain active when navigating between pages.

8.5 Playlist

Users can:

Create playlist
Rename playlist
Delete playlist
Add songs
Remove songs
Reorder songs
Change visibility
Follow public playlists

Playlist visibility:

PUBLIC
PRIVATE
8.6 Like Songs

Users can:

Like song
Unlike song
View liked songs

Use:

user_liked_songs
8.7 Follow Artists

Users can:

Follow artist
Unfollow artist
View followed artists

Use:

user_followed_artists
8.8 Listening History

Track:

User
Song
Played time
Duration played
Completed
Device

Use:

listening_history
8.9 Recently Played

Display recently played songs.

Use:

recently_played
9. Premium Subscription

Available plans:

FREE
PREMIUM
FAMILY

Subscription statuses:

ACTIVE
EXPIRED
CANCELLED

Users can:

View plans
Subscribe
View current subscription
View subscription history
Cancel subscription
10. Payment

Supported payment providers:

MOMO
VNPAY
STRIPE

Payment statuses:

PENDING
SUCCESS
FAILED
REFUNDED

Payment flow:

User
 ↓
Select subscription
 ↓
Create payment
 ↓
Payment provider
 ↓
Payment callback
 ↓
Laravel verifies transaction
 ↓
Update payment
 ↓
Update subscription
 ↓
Return result to React

Never trust payment status sent directly from the frontend.

11. Notifications

Users can receive:

System notifications
New release notifications
Playlist notifications
Follow notifications
Payment notifications

Notification statuses:

READ
UNREAD
12. Reports

Users can report:

Song
Artist
Playlist

Report status:

PENDING
REVIEWING
RESOLVED
REJECTED

Admin can:

View reports
Review reports
Resolve reports
Reject reports
13. Database

Database:

melora_db

MySQL:

MySQL 8.x

The database is normalized to 3NF.

Main entities:

roles
users
artists
genres
albums
songs
song_artists
song_genres
album_genres
playlists
playlist_songs
user_liked_songs
user_followed_artists
user_followed_playlists
listening_history
subscriptions
payments
notifications
reports
recently_played
user_roles
password_reset_tokens
social_accounts

The provided SQL schema is the source of truth for database implementation.

14. API Convention

API base URL:

/api

Response format:

{
  "success": true,
  "message": "Request successful",
  "data": {}
}

Error format:

{
  "success": false,
  "message": "Validation failed",
  "errors": {}
}

Use proper HTTP status codes:

200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
422 Unprocessable Entity
500 Internal Server Error
15. Frontend API Layer

Do not call Axios directly everywhere.

Use centralized API modules.

Example:

src/api/
├── auth.api.ts
├── song.api.ts
├── artist.api.ts
├── album.api.ts
├── playlist.api.ts
├── subscription.api.ts
├── payment.api.ts
├── notification.api.ts
└── report.api.ts

Example:

export const songApi = {
  getSongs: () => api.get("/songs"),

  getSong: (id: number) =>
    api.get(`/songs/${id}`),

  likeSong: (id: number) =>
    api.post(`/songs/${id}/like`)
};
16. Frontend State Management

Use Redux Toolkit for global state.

Recommended stores:

authStore
playerStore
playlistStore
subscriptionStore
notificationStore

Do not put every local component state into Redux.

Use React local state for local UI state.

17. React Routing

Public pages:

/
 /search
 /songs/:id
 /artists/:id
 /albums/:id
 /playlists/:id
 /login
 /register
 /forgot-password

Authenticated pages:

/library
/liked-songs
/history
/recently-played
/playlists
/subscription
/settings

Artist pages:

/artist/dashboard
/artist/songs
/artist/albums
/artist/statistics

Admin pages:

/admin
/admin/users
/admin/roles
/admin/artists
/admin/albums
/admin/songs
/admin/genres
/admin/reports
/admin/payments
/admin/subscriptions
18. UI / UX

Design direction:

Premium
Modern
Dark
Minimal
Music-focused
Vietnamese-inspired

The interface should feel like a professional commercial music streaming platform.

Avoid copying Spotify or Apple Music exactly.

Use original layouts and components.

Responsive:

Desktop
Tablet
Mobile
19. Loading / Error / Empty States

Every API-driven page must handle:

Loading
Skeleton / Spinner
Error
Friendly error message
Retry button
Empty
No songs found
No playlists found
No history
No notifications

Never leave a blank screen.

20. Security

Backend MUST validate:

Request data
Authentication
Authorization
File uploads
Payment callbacks

Never trust:

User role from frontend
Payment status from frontend
User ID from frontend
Subscription status from frontend

Use Laravel authorization policies / middleware where appropriate.

21. Code Quality

Follow:

SOLID principles
DRY
Separation of concerns
Reusable components
Clean API structure
Meaningful naming
Consistent formatting

Avoid:

Huge components
Duplicated code
Business logic inside JSX
Raw SQL inside controllers
Hardcoded credentials
Hardcoded API URLs
any everywhere
22. Environment Variables

Frontend:

VITE_API_URL=

Backend:

APP_NAME=MELORA
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=

DB_CONNECTION=mysql
DB_HOST=
DB_PORT=3306
DB_DATABASE=melora_db
DB_USERNAME=
DB_PASSWORD=

Never commit .env.

Commit:

.env.example
23. Docker

The project should support:

docker compose up -d

Services:

frontend
backend
mysql

Optional:

phpmyadmin
24. Development Order

Phase 1 — Foundation (Completed)
- Project setup (ReactJS + Laravel API)
- MySQL connection
- Environment configuration
- Docker
- API client

Phase 2 — Authentication (Completed)
- Register, Login, Logout
- Protected routes
- Forgot password, Reset password
- Google Auth

Phase 3 — Music (Completed)
- Songs, Artists, Albums, Genres
- Search functionality
- Music player integration

Phase 4 — User Library (Completed)
- Like songs
- Follow artists
- Playlists & History
- Recently played

Phase 5 — Subscription (Completed)
- Membership plans
- Payments integrations mock/callback
- Admin Dashboard metrics
Subscription plans
Subscription management
Payment
Payment callback
Payment history
Phase 6 — Notifications
Notification API
Notification UI
Read/unread
Mark as read
Phase 7 — Reports
Create report
Admin report management
Report status
Phase 8 — Artist
Artist dashboard
Song management
Album management
Statistics
Phase 9 — Admin
Dashboard
User management
Role management
Music management
Report management
Payment management
Subscription management
Phase 10 — Finalization
Validation
Error handling
Loading states
Responsive UI
Security review
API testing
Frontend testing
Build production
Docker verification
README update
25. AI Agent Instructions

You are the lead full-stack developer for this project.

Before writing code:

Read this README completely.
Read the database schema.
Understand all relationships.
Create an implementation plan.
Identify dependencies between features.
Do not start coding randomly.

When implementing:

Complete one feature end-to-end.
Backend API first.
Test backend API.
Implement frontend integration.
Test frontend.
Fix errors.
Move to the next feature.

For every feature:

Database
 ↓
Model
 ↓
Migration
 ↓
Controller
 ↓
Service
 ↓
Request Validation
 ↓
API Route
 ↓
API Test
 ↓
Frontend API
 ↓
TypeScript Types
 ↓
Hook / State
 ↓
Component
 ↓
Page
 ↓
UI states

Do not create disconnected UI that has no backend implementation.

26. Definition of Done

A feature is NOT considered complete until:

Backend API works
Validation works
Authorization works
Database operations work
API errors are handled
Frontend calls the real API
Loading state exists
Empty state exists
Error state exists
Responsive UI works
No TypeScript errors
No Laravel errors
No console errors
Feature has been manually tested
27. Final Requirement

The final application must be a functional full-stack application, not a static frontend demo.

All important user interactions must work end-to-end:

ReactJS
   ↓
Laravel API
   ↓
MySQL

Do not use fake data for completed features.

Do not mark a feature as completed if only the UI has been created.

If something cannot be implemented because an external service or credential is unavailable, clearly document:

What is missing
Why it is required
Where it should be configured
How the feature will work after configuration

Never silently replace a required real feature with fake behavior.