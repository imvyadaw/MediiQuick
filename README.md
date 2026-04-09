# MediiQuick — Medicine Delivery Platform

## 📋 Overview

MediiQuick is a complete **multi-role pharmacy delivery platform** built with pure HTML, CSS, and JavaScript. It supports three distinct user roles (Customer, Admin, Delivery Boy) with full CRUD functionality and Firebase Firestore for real-time data sync across all devices.

---

## 🎯 Key Features by Role

### 👤 Customer Features
| Feature | Description |
|---------|-------------|
| **Browse Medicines** | Category-wise browsing (Fever, Allergy, Heart, Diabetes, Cold, BP, Bone, Respiratory, Brain) + dynamic custom categories from admins |
| **Search Medicines** | Real-time search by medicine name or description |
| **Cart Management** | Add/remove items, update quantities, cart persists across sessions and devices via Firestore |
| **Address Management** | Save multiple addresses, set default, auto-fetch city from PIN code using postal API |
| **Order Placement** | COD, UPI, Card, Net Banking, Wallet payment options |
| **Order Tracking** | Real-time status updates, 30-minute ETA countdown, delivery partner tracking |
| **Rider Contact** | View assigned rider name & phone number, direct call from order page |
| **Profile Management** | Edit name, email, mobile, gender |
| **Wishlist** | Save favorite medicines for later |

### 🏥 Admin Features
| Feature | Description |
|---------|-------------|
| **Medicine Management** | Add/Edit/Delete medicines, update stock quantity & price |
| **Bulk Import** | CSV upload for medicines (Name, Quantity, Price) with duplicate handling |
| **Custom Categories** | Create new categories with custom emoji icons & colors |
| **Order Management** | View all orders, filter by status, update order status flow |
| **Delivery Boy Management** | Add/Edit/Delete delivery boys, toggle online/offline status |
| **Rider Assignment System** | Broadcast order requests to available riders, auto-accept with 10-min expiry |
| **Analytics Dashboard** | Revenue tracking, top-selling medicines, order success rate |
| **Low Stock Alerts** | Automatic highlighting of medicines with stock < 10 units |
| **Pharmacy Profile** | Set city, delivery radius, served PIN codes, GPS location |
| **Clear Order History** | Bulk delete delivered/cancelled orders |

### 🏍️ Delivery Boy Features
| Feature | Description |
|---------|-------------|
| **Rider Registration** | Self-registration with name, phone, vehicle type, city, PIN code, delivery range |
| **Login System** | Phone number + password authentication with hashed password storage |
| **Order Acceptance** | Receive broadcast requests in real-time, accept/reject within 10-minute window |
| **Status Management** | Set available/offline status, auto-busy when on active delivery |
| **Delivery Confirmation** | Mark orders as delivered, auto-update total delivered count |
| **Profile Edit** | Update name, phone, vehicle, city, PIN code, delivery range, password |
| **Account Deletion** | Delete own account permanently from the system |
| **GPS Location** | Share live location with pharmacy for better assignment |

---

## 🏗️ System Architecture

### Firebase Firestore Collections

```
Firestore Database Structure:
│
├── admins              → Admin registration (hashed passwords, adminId, shop details)
├── users               → Customer registration (email, name, mobile, GPS)
├── riders              → Delivery boy profiles (name, phone, vehicle, city, PIN, status)
├── medicines           → Medicine inventory (name, price, quantity, category)
├── customCategories    → Admin-created categories (icon, label, color)
├── orders              → All orders (items, total, status, delivery address, timestamps)
├── riderRequests       → Real-time delivery requests broadcast to riders
├── pharmacyProfiles    → Pharmacy settings (city, served PINs, delivery radius, GPS)
├── carts               → User cart data synced across devices
└── userAddresses       → Saved addresses per user (type, street, city, PIN, phone)
```

### Data Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Customer   │────▶│   Admin     │────▶│    Rider    │
│   places    │     │  confirms   │     │  accepts    │
│    order    │     │   & packs   │     │  delivers   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────┐
│                    Firebase Firestore                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │ orders  │  │ admins  │  │ riders  │  │riderReq │    │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Admin Assignment Logic (Zepto/Blinkit Style)

```javascript
   Priority-based admin matching
Priority 1: PIN code + City both match → ✅ Assign immediately
Priority 2: PIN matches but city different → ❌ Skip this admin
Priority 3: City matches + distance within radius → ✅ Assign
Priority 4: GPS fallback (no PIN/city) → ✅ Assign if within radius
Priority 5: No match → ❌ Order cannot be placed
```

---

## 📁 Complete File Structure

```
mediiquick/
│
├── 📄 Customer Pages
│   ├── index.html              # Homepage — browse & order medicines
│   ├── profile.html            # Customer dashboard (cart, orders, address)
│   ├── login.html              # Unified login (User/Admin/Rider tabs)
│   ├── signupuser.html         # Customer registration
│   ├── myprofile.html          # Customer profile editor
│   └── my_order.html           # Order tracking & history
│
├── 📄 Admin Pages
│   ├── adminpage.html          # Admin dashboard (full management)
│   ├── admin-login.html        # Dedicated admin login
│   └── admin-signup.html       # Pharmacy partner registration
│
├── 📄 Rider Pages
│   ├── delivery-dashboard.html # Rider portal
│   └── delivery-signup.html    # Delivery boy registration
│
├── 📄 Shared
│   ├── firebase-config.js      # Firebase initialization (shared across all pages)
│   └── utils.js                # Helper functions (haversine distance, password hash)
│
└── 📄 Documentation
    └── README.md               # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection (for Firebase and CDN resources)
- Firebase account (free tier works)

### Step 1: Clone or Download
```bash
git clone <repository-url>
cd mediiquick
```

### Step 2: Firebase Configuration

Create a Firebase project at [https:  console.firebase.google.com/](https:  console.firebase.google.com/)

Enable these services:
- **Firestore Database** (create in test mode)
- **Authentication** (Email/Password sign-in method)

Update `firebase-config.js` with your credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 3: Run Locally
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (npx)
npx serve

# Using VS Code Live Server
Right-click index.html → Open with Live Server

# Or open directly (limited functionality due to CORS)
open index.html
```

### Step 4: Firebase Security Rules (Recommended)

```javascript
   Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;     Test mode only
    }
  }
}
```

> ⚠️ **Production:** Implement proper authentication-based security rules before going live.

---

## 🔐 Authentication System Details

| Role | Login Credentials | Session Key | Registration Page | Password Storage |
|------|-------------------|-------------|-------------------|------------------|
| **Customer** | Email + Password | `mq_user` | `signupuser.html` | Firebase Auth |
| **Admin** | Admin ID or Email + Password | `mq_admin_session` | `admin-signup.html` | SHA-256 hashed |
| **Rider** | Phone Number + Password | `mq_db_session` | `delivery-signup.html` | SHA-256 hashed |

### Password Hashing (SHA-256 with Salt)
```javascript
async function hashPassword(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain + 'mq_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

---

## 💾 Data Storage Strategy

### Firebase Firestore (Primary - Real-time)
| Collection | Purpose | Real-time Sync |
|------------|---------|----------------|
| `orders` | All customer orders | ✅ via onSnapshot |
| `medicines` | Medicine inventory | ✅ via onSnapshot |
| `riders` | Delivery boy profiles | ✅ via onSnapshot |
| `riderRequests` | Broadcast requests | ✅ via onSnapshot |
| `customCategories` | Admin categories | ✅ on page load |
| `pharmacyProfiles` | Pharmacy settings | ✅ on page load |
| `carts` | User cart data | ✅ on page load |
| `userAddresses` | Saved addresses | ✅ on page load |
| `admins` | Admin accounts | 🔒 write only |
| `users` | Customer accounts | 🔒 write only |

### localStorage (Secondary - Session Only)
| Key | Purpose | Expiry |
|-----|---------|--------|
| `mq_user` | Customer session | 24 hours |
| `mq_admin_session` | Admin session | 24 hours |
| `mq_db_session` | Rider session | 24 hours |

> **Note:** The project uses **Firestore as the single source of truth**. localStorage only stores session tokens for authentication persistence.

---

## 📊 Order Status Flow

```
┌──────────┐     ┌───────────┐     ┌─────────┐     ┌──────────────┐     ┌───────────┐
│ PENDING  │────▶│ CONFIRMED │────▶│ PACKING │────▶│ PENDING_     │────▶│ ON_THE_   │
│ (Placed  │     │ (Admin    │     │ (Admin  │     │ ACCEPTANCE   │     │ WAY       │
│ by user) │     │ confirms) │     │ packs)  │     │ (Awaiting    │     │ (Rider    │
└──────────┘     └───────────┘     └─────────┘     │ rider)       │     │ accepted) │
                                                    └──────────────┘     └───────────┘
                                                                                │
                                                                                ▼
┌───────────┐     ┌───────────┐                                              ┌───────────┐
│ CANCELLED │◀────│  REJECTED │                                              │ DELIVERED │
│ (Admin or │     │ (All      │                                              │ (Rider    │
│ customer) │     │ riders    │                                              │ marks)    │
└───────────┘     │ rejected) │                                              └───────────┘
                  └───────────┘
```

---

## 🚴 Rider Request System (Real-time)

### Broadcast Flow
1. **Admin** clicks "Send Request to All Riders" during `packing` status
2. Firestore `riderRequests` collection gets a new document with:
   - Order details (customer name, address, items, total)
   - List of rider IDs to notify
   - 10-minute expiry timestamp
3. All available riders receive real-time notification via `onSnapshot`
4. **First rider to accept** gets the order
5. Order status changes to `on_the_way` with assigned rider
6. If **all riders reject** → order automatically cancelled
7. If **no response in 10 minutes** → request expires, order returns to `packing`

### Rider Request Document Structure
```javascript
{
  orderId: "MQ12345678",
  customerName: "John Doe",
  address: "Sector 62, Noida",
  city: "Noida",
  total: 450,
  payMethod: "COD",
  items: "Paracetamol x2, Dolo 650 x1",
  distanceKm: 4.2,
  riderIds: ["DB123", "DB456", "DB789"],
  rejectedBy: ["DB456"],
  sentAt: 1712345678900,
  expiresAt: 1712346278900,     +10 minutes
  acceptedBy: null,
  expired: false,
  processedByAdmin: false
}
```

---

## 🛠️ Key Functions Reference

### Customer Side (profile.html)
```javascript
addToCart(id)                 Add medicine to cart
changeQty(id, delta)          Update quantity
placeOrder()                  Validate address → find admin → save to Firestore
trackOrder(orderId)           Real-time status updates via onSnapshot
saveAddress(address)          Save to Firestore userAddresses collection
loadAddresses()               Load from Firestore memory cache
```

### Admin Side (adminpage.html)
```javascript
saveMedicine()                Add/update medicine, sync to Firestore
bulkImport(csvData)           Parse CSV, add medicines, update Firestore
updateOrderStatus()           Update status, broadcast to riders if packing→pending_acceptance
broadcastToRiders()           Create rider request document in Firestore
deleteDeliveryBoy(id)         Remove rider from Firestore riders collection
renderOrders()                Real-time via onSnapshot subscription
renderMedicines()             Load from window._mqMedCache (Firestore sync)
```

### Rider Side (delivery-dashboard.html)
```javascript
acceptRequest(orderId)        Update rider request (acceptedBy), update order status
rejectRequest(orderId)        Update rejectedBy array, check if all rejected
markDelivered(orderId)        Update order status to delivered, free rider
setStatus(status)             Update availability in Firestore riders collection
getMe()                       Fetch rider profile from Firestore
subscribeRiderRequests()      Real-time listener for new requests
```

---

## 📱 Responsive Design Breakpoints

| Device | Breakpoint | Layout Changes |
|--------|------------|----------------|
| **Desktop** | > 1100px | Full sidebar, 6-column medicine grid |
| **Tablet** | 768px - 1100px | Collapsed sidebar, 4-column grid, hidden features panel |
| **Mobile** | < 580px | Bottom navigation bar, 2-column grid, stacked forms |

---

## 🧪 Testing Credentials

### Customer Account
```
Email: test@example.com
Password: Test@123
```

### Admin Account
```
Admin ID: ADMIN-123456
Email: admin@pharmacy.com
Password: Admin@123
```

### Rider Account
```
Phone: 9876543210
Password: Rider@123
```

---

## 📦 Dependencies (CDN)

| Library | Version | Purpose | CDN URL |
|---------|---------|---------|---------|
| Firebase | 10.12.0 | Backend & real-time sync | `https:  www.gstatic.com/firebasejs/10.12.0/firebase-*.js` |
| Font Awesome | 6.4.0 | Icons | `https:  cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css` |
| Google Fonts | - | Poppins font | `https:  fonts.googleapis.com/css2?family=Poppins` |

---

## 🔧 Environment Variables

Create a `.env` file (optional) or directly edit `firebase-config.js`:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

---

## 🐛 Known Issues & Workarounds

| Issue | Status | Workaround |
|-------|--------|-------------|
| Social login (Google/Facebook) | 🚧 Coming soon | Use email/password registration |
| SMS notifications | 🚧 Planned | Email notifications only |
| Push notifications | 🚧 Planned | Browser notifications available for new orders |
| Offline mode | 🚧 Limited | Firestore offline persistence enabled for reads |

---

## 🔜 Future Enhancements

- [ ] **Live chat** between customer and pharmacy
- [ ] **Prescription upload** for scheduled drugs
- [ ] **Multi-pharmacy order splitting** (different items from different pharmacies)
- [ ] **Delivery route optimization** for multiple orders
- [ ] **Push notifications** (Web Push API)
- [ ] **Invoice PDF generation** for orders
- [ ] **Loyalty points system** with rewards
- [ ] **Scheduled deliveries** for future dates
- [ ] **Medicine subscription** (monthly automatic refill)
- [ ] **Rating & review** system for medicines and riders

---

## 👥 Development Team

Built with ❤️ for MediiQuick — Your trusted medicine delivery partner.

---

## 📄 License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 📞 Support

For technical issues or feature requests:
- 📧 Email: support@mediiquick.com
- 📱 Phone: +91-XXXXXXXXXX

---

## 📝 Changelog

### Version 1.0.0 (April 2026)
- ✅ Initial release with full customer, admin, and rider functionality
- ✅ Firebase Firestore integration for real-time sync
- ✅ Zepto/Blinkit-style admin assignment system
- ✅ Real-time rider request broadcasting with 10-min expiry
- ✅ Bulk medicine import via CSV
- ✅ Order tracking with ETA countdown
- ✅ Multi-address support for customers

---

*Last Updated: April 2026*