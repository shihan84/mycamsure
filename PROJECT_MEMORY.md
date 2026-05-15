# PROJECT_MEMORY.md

## Last Updated: 2026-05-15T13:00:00Z
## AI Agent Session ID: session_001

## 1. Current Sprint Goal
Complete core platform features: backend API, React website, Flutter apps (customer & technician), dashboards.

## 2. Completed Features
- Prisma schema design – 2026-05-15 – `/prisma/schema.prisma`
- Backend environment setup – 2026-05-15 – `/backend/.env`, `/backend/.env.example`, `/backend/.gitignore`
- POST /api/service-request endpoint – 2026-05-15 – `/backend/src/routes/serviceRequest.ts`
- POST /api/payment/create-order endpoint – 2026-05-15 – `/backend/src/routes/payment.ts`
- POST /api/payment/verify endpoint – 2026-05-15 – `/backend/src/routes/payment.ts`
- GET /api/payment/:id endpoint – 2026-05-15 – `/backend/src/routes/payment.ts`
- GET /api/jobs/nearby endpoint – 2026-05-15 – `/backend/src/routes/jobs.ts`
- PATCH /api/jobs/:id/status endpoint – 2026-05-15 – `/backend/src/routes/jobs.ts`
- GET /api/jobs/my endpoint – 2026-05-15 – `/backend/src/routes/jobs.ts`
- GET /api/earnings endpoint – 2026-05-15 – `/backend/src/routes/earnings.ts`
- POST /api/earnings/withdraw endpoint – 2026-05-15 – `/backend/src/routes/earnings.ts`
- GET /api/franchise/earnings endpoint – 2026-05-15 – `/backend/src/routes/franchise.ts`
- GET /api/franchise/technicians endpoint – 2026-05-15 – `/backend/src/routes/franchise.ts`
- POST /api/franchise/technicians/:id/approve – 2026-05-15 – `/backend/src/routes/franchise.ts`
- POST /api/franchise/technicians/:id/suspend – 2026-05-15 – `/backend/src/routes/franchise.ts`
- GET /api/franchise/complaints endpoint – 2026-05-15 – `/backend/src/routes/franchise.ts`
- Auth middleware implementation – 2026-05-15 – `/backend/src/middleware/auth.ts`
- Socket.io server setup – 2026-05-15 – `/backend/src/index.ts`
- Backend server setup – 2026-05-15 – `/backend/src/index.ts`, `/backend/package.json`, `/backend/tsconfig.json`
- React website structure – 2026-05-15 – `/web/package.json`, `/web/vite.config.ts`, `/web/tsconfig.json`
- React website components – 2026-05-15 – `/web/src/components/Button.tsx`, `/web/src/components/Input.tsx`, `/web/src/components/Navbar.tsx`
- React website pages – 2026-05-15 – `/web/src/pages/HomePage.tsx`, `/web/src/pages/BookServicePage.tsx`, `/web/src/pages/TrackServicePage.tsx`, `/web/src/pages/LoginPage.tsx`, `/web/src/pages/SignupPage.tsx`
- React website utilities – 2026-05-15 – `/web/src/lib/utils.ts`, `/web/src/lib/supabase.ts`, `/web/src/lib/api.ts`
- Flutter customer app – Book Service screen – 2026-05-15 – `/mobile/lib/customer_app/screens/book_service_screen.dart`
- Flutter technician app – Job List screen – 2026-05-15 – `/mobile/lib/technician_app/screens/job_list_screen.dart`
- Flutter technician app – Job Details screen – 2026-05-15 – `/mobile/lib/technician_app/screens/job_details_screen.dart`
- Flutter technician app – Earnings screen – 2026-05-15 – `/mobile/lib/technician_app/screens/earnings_screen.dart`
- Flutter technician app – Main app with navigation – 2026-05-15 – `/mobile/lib/flavors/main_technician.dart`
- Flutter app structure – 2026-05-15 – `/mobile/lib/common/models/service_request.dart`, `/mobile/lib/common/api/api_client.dart`
- Flutter flavor configuration – 2026-05-15 – `/mobile/lib/flavors/main_customer.dart`, `/mobile/lib/flavors/main_technician.dart`
- Flutter dependencies – 2026-05-15 – `/mobile/pubspec.yaml`

## 3. Pending / In Progress
- [ ] Set up PostgreSQL database and run Prisma migrations
- [ ] Install npm dependencies for backend and web
- [X] Implement Razorpay payment integration in backend
- [ ] Implement Stripe payment integration in backend
- [X] Add Google Maps integration for technician navigation in Flutter
- [X] Build franchisee dashboard web interface
- [X] Build admin dashboard web interface
- [ ] Add auth middleware protection to service-request route
- [ ] Implement Socket.io real-time notifications in Flutter apps
- [ ] Add before/after photo upload for technicians
- [ ] Implement review/rating system for customers

## 4. Key Technical Decisions (locked)
- Frontend: React + Tailwind + Vite
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL + Prisma
- Mobile: Flutter (single codebase, two flavors)
- Auth: Firebase Authentication (Phone OTP)
- Payments: Razorpay + Stripe
- Real-time: Socket.io
- Push: Firebase Cloud Messaging (FCM)
- Hosting: Hostinger (self-hosted)

## 5. Database Schema (implemented)
- User (id, name, email, phone, role, created_at) – with relations to franchise, technician, service requests
- Franchise (id, name, owner_id, commission_rate, status, region, city, state, pincode, address) – with relations to owner, technicians, service requests, AMC contracts
- Technician (id, user_id, franchise_id, is_verified, rating, total_jobs, location_lat, location_lng, documents, skills, experience) – with relations to user, franchise, service requests, earnings
- ServiceRequest (id, customer_id, technician_id, franchise_id, type, status, scheduled_at, address, latitude, longitude, description, photos, total_amount, commission_amount, technician_amount) – with relations to customer, technician, franchise, AMC contract, payment, review
- AMCContract (id, customer_id, franchise_id, start_date, end_date, plan_type, price, status, total_visits, visits_used, renewal_count) – with relations to customer, franchise, service requests
- PaymentTransaction (id, service_request_id, amc_contract_id, user_id, amount, status, razorpay_order_id, razorpay_payment_id, stripe_payment_intent_id, payment_method, franchise_share, admin_share, technician_share) – with relations to service request, user
- Review (id, service_request_id, customer_id, rating, comment) – with relations to service request, customer
- Notification (id, user_id, title, message, type, is_read, data) – with relation to user
- Earnings (id, technician_id, amount, job_id, type, status, created_at, withdrawn_at) – with relation to technician

## 6. API Endpoints (by role)
### Public
- POST /api/auth/signup – create user account after Firebase auth (IMPLEMENTED) – `/backend/src/routes/auth.ts`
- POST /api/service-request – customer books service (IMPLEMENTED) – `/backend/src/routes/serviceRequest.ts`
- GET /health – health check endpoint (IMPLEMENTED) – `/backend/src/index.ts`

### Customeauth/me – get current urer info (IMPLEMENTED) – `/back nd/src/(outes/auth.ts`
- GET /api/serplanned)
- GET /api/services – list available services
- GET /api/service-request/:id – get service request details
- GET /api/service-request – get customer's service requests
- POST /api/review – submit review for technician
- GET /api/amc-contracts – get customer's AMC contracts

### Technician
- GET /api/jobs/nearby – technician sees nearby jobs (IMPLEMENTED) – `/backend/src/routes/jobs.ts`
- PATCH /api/jobs/:id/status – technician updates job status (IMPLEMENTED) – `/backend/src/routes/jobs.ts`
- GET /api/jobs/my – technician sees assigned jobs (IMPLEMENTED) – `/backend/src/routes/jobs.ts`
- POST /api/jobs/:id/photos – upload before/after photos (PENDING)
- GET /api/earnings – view earnings (IMPLEMENTED) – `/backend/src/routes/earnings.ts`
- POST /api/earnings/withdraw – request withdrawal (IMPLEMENTED) – `/backend/src/routes/earnings.ts`

### Franchisee
- GET /api/franchise/earnings – franchisee dashboard earnings (IMPLEMENTED) – `/backend/src/routes/franchise.ts`
- GET /api/franchise/technicians – manage technicians (IMPLEMENTED) – `/backend/src/routes/franchise.ts`
- POST /api/franchise/technicians/:id/approve – approve technician (IMPLEMENTED) – `/backend/src/routes/franchise.ts`
- POST /api/franchise/technicians/:id/suspend – suspend technician (IMPLEMENTED) – `/backend/src/routes/franchise.ts`
- GET /api/franchise/complaints – view customer complaints (IMPLEMENTED) – `/backend/src/routes/franchise.ts`
- PATCH /api/franchise/pricing – update regional pricing (PENDING)

### Admin (planned)
- GET /api/admin/analytics – platform-wide analytics
- POST /api/admin/franchises/approve – approve new franchise
- POST /api/admin/franchises/:id/suspend – suspend franchise
- GET /api/admin/technicians – view all technicians
- GET /api/admin/disputes – view disputes
- POST /api/admin/broadcast – send push notification to all users

## 7. Flutter App Structure (implemented)
- lib/
  - customer_app/
    - screens/
      - book_service_screen.dart (IMPLEMENTED)
  - technician_app/
    - screens/
      - job_list_screen.dart (IMPLEMENTED)
      - job_details_screen.dart (IMPLEMENTED)
      - earnings_screen.dart (IMPLEMENTED)
  - common/
    - models/
      - service_request.dart (IMPLEMENTED)
    - api/MPLEMENTED)
  - flavors/
    - main_customer.dart (IMPLEMENTED)
    - main_technician.dart (IMPLEMENTED)

## 8. Known Issues
- None yet.

## 9. Next Immediate Action Items
- [X] Install backend dependencies: `cd backend && npm install`
- [X] Install web dependencies: `cd web && npm install`
- [X] Install Flutter dependencies: `cd mobile && flutter pub get`
- [ ] Set up PostgreSQL database and run Prisma migrations
- [ ] Configure Firebase project and update environment variables
- [X] Apply auth middleware to protect service-request endpoint
- [X] Implement Razorpay payment integration in backend
- [X] Build franchisee dashboard React component
- [X] Build admin dashboard React component
- [ ] Add Socket.io client to Flutter apps for real-time updates
- [ ] Test end-to-end booking flow
