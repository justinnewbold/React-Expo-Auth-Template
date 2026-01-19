# React Expo Auth Template 🔐

A reusable Expo/React Native authentication template with Supabase, role-based access control, and a **Dev Toolbar** for quick iteration without constant re-login.

## Features

- ✅ **Supabase Authentication** - Login, signup, password reset
- ✅ **Role-Based Access** - Super Admin → Location Admin → Staff → Customer
- ✅ **Dev Toolbar** - Switch roles instantly during development (no login needed!)
- ✅ **Cross-Platform** - iOS, Android, and Web from one codebase
- ✅ **Expo Router** - File-based navigation
- ✅ **Protected Routes** - Automatic redirects based on auth state

---

## 🚀 Quick Start

### Step 1: Use This Template

1. Click **"Use this template"** button on GitHub
2. Name your new repo
3. Clone your new repo

### Step 2: Set Up Supabase

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Create a new project (or use existing)
3. Go to **SQL Editor** and run the contents of `supabase-setup.sql`
4. Go to **Settings → API** and copy:
   - Project URL
   - anon/public key

### Step 3: Configure Environment

1. Copy `.env.example` to `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 4: Install & Run

Using Expo Go (easiest):
1. Install Expo Go app on your phone
2. Open the project in your browser at expo.dev
3. Scan the QR code

---

## 🛠️ Dev Toolbar

The killer feature! During development, a floating toolbar appears that lets you:

1. **Skip Login Entirely** - Click "Enable Dev Mode" 
2. **Switch Roles Instantly** - Test as Super Admin, Staff, Customer, etc.
3. **See Current State** - Visual indicator of who you're logged in as

### How It Works

```
┌─────────────────────────────────────────┐
│           Your App (Development)        │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │     Your app content here       │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │ 🛠️ DEV MODE                      │   │
│   │ Current: Super Admin            │   │
│   │ [Super Admin] [Staff] [Customer]│   │
│   └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**In Production:** The toolbar is completely invisible. It checks `__DEV__` and only renders in development builds.

---

## 📁 Project Structure

```
├── app/                    # Expo Router screens
│   ├── _layout.js          # Root layout with AuthProvider
│   ├── index.js            # Entry point (redirects)
│   ├── (auth)/             # Auth screens (public)
│   │   ├── login.js
│   │   ├── signup.js
│   │   └── forgot-password.js
│   └── (app)/              # Protected screens
│       ├── _layout.js      # Auth guard
│       └── index.js        # Dashboard
│
├── components/
│   ├── DevToolbar.js       # 🛠️ The dev toolbar
│   ├── LoginForm.js
│   ├── SignupForm.js
│   └── RoleGate.js         # Permission-based rendering
│
├── contexts/
│   └── AuthContext.js      # Auth state & functions
│
├── lib/
│   └── supabase.js         # Supabase client
│
└── supabase-setup.sql      # Database setup script
```

---

## 🔒 Role System

### Hierarchy (higher = more permissions)

| Role | Level | Can Access |
|------|-------|------------|
| `super_admin` | 4 | Everything |
| `location_admin` | 3 | Location + below |
| `staff` | 2 | Staff areas + below |
| `customer` | 1 | Customer areas only |

### Using Roles in Components

```jsx
import { AdminOnly, SuperAdminOnly, RoleGate } from '../components/RoleGate';

// Only admins see this
<AdminOnly>
  <AdminDashboard />
</AdminOnly>

// Only super admins see this
<SuperAdminOnly>
  <SystemSettings />
</SuperAdminOnly>

// Custom role requirement
<RoleGate requiredRole="staff">
  <StaffSchedule />
</RoleGate>

// With fallback
<RoleGate requiredRole="admin" fallback={<UpgradePrompt />}>
  <PremiumFeature />
</RoleGate>
```

### Using Roles in Logic

```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { hasRole, isAdmin, isSuperAdmin, profile } = useAuth();

  if (hasRole('staff')) {
    // User is staff or higher
  }

  if (isAdmin()) {
    // User is location_admin or super_admin
  }

  if (isSuperAdmin()) {
    // User is super_admin only
  }

  console.log(profile.role); // 'customer', 'staff', etc.
}
```

---

## 🌐 Deployment

### Web (Vercel)

1. Connect repo to Vercel
2. Add environment variables:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy!

### Mobile (EAS Build)

1. Install EAS CLI: `npm install -g eas-cli`
2. Configure: `eas build:configure`
3. Add secrets: `eas secret:create`
4. Build: `eas build --platform all`

---

## 🎨 Customization

### Change Colors

Edit the color values in each component's `StyleSheet`. Main colors used:

- Background: `#0f0f23` (dark blue)
- Cards: `#1a1a2e` (slightly lighter)
- Primary: `#3498db` (blue)
- Success: `#2ecc71` (green)
- Warning: `#f39c12` (orange)
- Danger: `#e74c3c` (red)

### Add New Roles

1. Update `ROLES` in `contexts/AuthContext.js`
2. Update `DEV_USERS` for dev toolbar
3. Update `CHECK` constraint in `supabase-setup.sql`
4. Run the updated SQL

### Add New Protected Screens

1. Create file in `app/(app)/your-screen.js`
2. It's automatically protected!
3. Use `RoleGate` for additional role restrictions

---

## 📝 Making Your First Super Admin

After a user signs up, run this in Supabase SQL Editor:

```sql
UPDATE public.profiles 
SET role = 'super_admin' 
WHERE email = 'your-email@example.com';
```

---

## 🐛 Troubleshooting

### "Invalid API key" error
- Double-check your `.env` values
- Make sure you're using the `anon` key, not the `service_role` key

### Dev toolbar not showing
- Make sure you're in development mode (`expo start`, not a production build)
- Check that `__DEV__` is true

### Users stuck on login after signup
- Check if the profiles trigger ran (see `supabase-setup.sql`)
- Verify email confirmation is disabled in Supabase Auth settings (for testing)

---

## 📄 License

MIT - Use this template for any project!

---

Built with ❤️ for fast iteration
