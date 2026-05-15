# myCamSure

A comprehensive CCTV installation, maintenance, and AMC support platform with a franchise model.

## Tech Stack

### Backend
- **Runtime**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **Real-time**: Socket.io
- **Payments**: Razorpay (India) + Stripe (International)

### Frontend (Web)
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router
- **State**: Zustand

### Mobile Apps
- **Framework**: Flutter (Dart)
- **Single Codebase**: Two flavors (Customer & Technician)
- **Maps**: Google Maps
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Auth**: Supabase Flutter
- **Socket.io**: For real-time updates

## Project Structure

```
mycamsure/
├── backend/              # Node.js/Express backend
│   ├── src/
│   │   ├── middleware/   # Auth middleware
│   │   ├── routes/       # API routes
│   │   └── index.ts      # Server entry point
│   ├── prisma/           # Database schema
│   └── package.json
├── web/                  # React customer website
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   └── lib/          # Utilities & API clients
│   └── package.json
├── mobile/               # Flutter mobile apps
│   ├── lib/
│   │   ├── customer_app/ # Customer-specific screens
│   │   ├── technician_app/ # Technician-specific screens
│   │   ├── common/       # Shared code
│   │   └── flavors/      # App entry points
│   └── pubspec.yaml
├── prisma/               # Shared Prisma schema
└── PROJECT_MEMORY.md     # Project tracking
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Flutter 3.0+
- Supabase account
- Razorpay account (for payments)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

Backend runs on `http://localhost:3000`

### Web Setup

```bash
cd web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

Web app runs on `http://localhost:5173`

### Mobile Setup

```bash
cd mobile

# Install dependencies
flutter pub get

# Run customer app
flutter run -d <device> --flavor customer

# Run technician app
flutter run -d <device> --flavor technician
```

## API Endpoints

### Public
- `POST /api/service-request` - Book a service
- `GET /health` - Health check

### Customer
- `GET /api/service-request` - Get customer's service requests
- `GET /api/service-request/:id` - Get service request details
- `POST /api/review` - Submit review

### Technician
- `GET /api/jobs/nearby` - Get nearby jobs
- `GET /api/jobs/my` - Get assigned jobs
- `PATCH /api/jobs/:id/status` - Update job status
- `GET /api/earnings` - View earnings
- `POST /api/earnings/withdraw` - Request withdrawal

### Franchisee
- `GET /api/franchise/earnings` - View earnings
- `GET /api/franchise/technicians` - Manage technicians
- `POST /api/franchise/technicians/:id/approve` - Approve technician
- `POST /api/franchise/technicians/:id/suspend` - Suspend technician
- `GET /api/franchise/complaints` - View complaints

### Admin
- `GET /api/admin/analytics` - Platform analytics
- `POST /api/admin/franchises/approve` - Approve franchise
- `POST /api/admin/franchises/:id/suspend` - Suspend franchise
- `GET /api/admin/technicians` - View all technicians
- `GET /api/admin/disputes` - View disputes

## Authentication
- **Firebase Authentication** for user authentication
- Phone OTP-based authentication for customers and technicians
- Role-based access control (Customer, Technician, Franchisee, Admin)
- Firebase ID tokens verified on backend using Firebase Admin SDKs

## Database Schema

The platform uses the following main models:
- User (customers, technicians, franchisees, admins)
- Franchise (franchise partners)
- Technician (technician profiles)
- ServiceRequest (service bookings)
- AMCContract (annual maintenance contracts)
- PaymentTransaction (payment records)
- Review (customer reviews)
- Notification (user notifications)
- Earnings (technician earnings)
# Database
See `prisma/schema.prisma`username:password@localhost:5432/mycamsurer complete schema.

# Firebase uth
FIREPOJECT_IDyour_firebase_project_id
FIREnviroPRIVnTEt Varyour_firebase_private_keyles
FIREINTMAILyour_firebase_client_email

# Server
P BTn3000
CLINTULhttp://localhost:5173
DATABASE_URL=postgresql://...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABFIREBAAE__PI_KEY=your_firebase_api_key
VITE_FIRESERVIACTH_DOMAINRyour_firebase_project_idOfirebaseappLcom_KEY=...
RAZORFIREBAPE_YROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STOR_GE_BUCKET=your_firebase_storage_bucket
VITE_FIREKEY_IMESSDGI=G_SE.DER_ID=your_firebase_messaging_sender_id
VITE.FIREBAS_APP_IDyour_firebase_app_id
RAZORPAY_KEY_SECRET=...
STRIPE_SECRET_KEY=...
FIREBASE_PROJECT_ID=...
JWT_SECRET=...
```

### Web (.env)
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=http://localhost:3000/api
```

## Features

### Customer
- Book CCTV installation, repair, or maintenance
- Track service status in real-time
- View AMC contract history
- Rate and review technicians
- Pay online or cash on service

### Technician
- View nearby jobs on map
- Accept/reject job requests
- Navigate to customer location
- Update job status (arrived → working → completed)
- Upload before/after photos
- View earnings and request withdrawals

### Franchisee
- Manage technicians under franchise
- View earnings and commission
- Approve/reject technician applications
- Handle customer complaints
- Set regional pricing

### Admin
- Approve/reject franchise applications
- View platform-wide analytics
- Manage technicians across all franchises
- Handle disputes
- Send broadcast notifications

## Development Progress

See `PROJECT_MEMORY.md` for detailed progress tracking.

## License

Proprietary - All rights reserved
