# 💊 MediiQuick — 30-Minute Medicine Delivery Platform

<div align="center">

![MediiQuick Banner](./images/6ab4d9fc-53f8-46cf-b443-33dacb111091.webp)

**A full-stack, multi-role medicine delivery web application**  
*Vanilla HTML · CSS · JavaScript (ES6+)*

[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen)]()

</div>

---

## 📌 What is MediiQuick?

MediiQuick is a **medicine delivery platform** that connects customers with local pharmacies and delivery riders — promising 30-minute delivery. Built entirely in **vanilla HTML/CSS/JavaScript**, it supports three distinct user roles and a complete order lifecycle from placement to delivery.

This started as a college CSE diploma project and evolved into a full-featured app demonstrating real-world concepts like real-time databases, role-based access control, geolocation matching, and live order tracking.

---

## ✨ Feature Overview

### 👤 Customer
- Browse 300+ medicines across multiple categories (Tablets, Syrups, Injections, Baby Care, Vitamins, Skin Care, etc.)
- Search, filter by category, add to cart & wishlist ❤️
- Multiple saved delivery addresses
- Prescription upload support (linked to orders)
- Real-time order tracking: `pending → confirmed → packing → on the way → delivered`
- Invoice generation & PDF download
- UPI / Card / Net Banking / COD payment options
- Dark mode 🌙
- Customer support chat widget with ticket system

### 🏪 Pharmacy Admin
- Full order management dashboard with real-time updates
- Inventory management — add/edit/delete medicines, create custom categories
- Rider request broadcast system — assign orders to nearby riders
- Real-time earnings tracker (filtered by assigned pharmacy)
- Pharmacy profile with zone/PIN-based delivery area configuration
- Three availability states: **Online / Coming Soon / Temporarily Unavailable**
- Support ticket dashboard for responding to customer queries

### 🏍️ Delivery Rider
- Live dashboard with real-time order broadcasts
- Accept/reject orders with countdown timer
- GPS location tracking via browser Geolocation API
- Wallet & earnings history with UPI payout requests
- Delivery history log

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| **Geolocation** | Haversine formula + Browser Geolocation API + Nominatim reverse geocoding |
| **Security** | SHA-256 password hashing + XSS sanitization |
| **Fonts** | Google Fonts (Poppins, Inter) |
| **Icons** | Font Awesome 6 |

---

## 📁 Project Structure

```
MediiQuick/
│
├── index.html                   # Customer homepage — medicine catalog, cart, search
├── profile.html                 # Customer main profile & order placement
├── myprofile.html               # Extended profile management
├── my_order.html                # Order history & real-time tracking
├── wishlist.html                # Saved medicines
├── prescription-upload.html     # Prescription upload flow
├── invoice.html                 # Printable/downloadable PDF invoice
│
├── user-login.html              # Customer login
├── admin-login.html             # Pharmacy admin login
├── rider-login.html             # Delivery rider login
├── signup.html                  # Role selector landing page
├── signupuser.html              # Customer signup
├── delivery-signup.html         # Rider signup
│
├── adminpage.html               # Pharmacy admin dashboard (orders, inventory)
├── pharmacy-earnings.html       # Real-time pharmacy revenue tracker
│
├── delivery-dashboard.html      # Rider live order dashboard
├── rider-wallet.html            # Rider earnings, wallet & payout requests
│
├── utils.js                     # Shared utility functions (Haversine, hash, format)
├── auth-session.js              # Role session helpers & normalization
│
├── auth/
│   ├── guard.js                 # Route guard — validates session before page loads
│   └── roles.js                 # Role constants & redirect maps
│
├── services/
│   ├── orders.js                # Order status transitions
│   ├── payouts.js               # Rider payout request & approval logic
│   └── uploads.js               # Prescription upload helpers
│
├── utils/
│   ├── validators.js            # Input validation helpers (UPI, required fields, etc.)
│   ├── sanitize.js              # XSS sanitization (escapeHTML)
│   ├── ui.js                    # Shared UI helpers (toast, loaders, etc.)
│   └── logger.js                # Debug logger wrapper
│
└── images/                      # Medicine & UI assets
```

---

## 🔐 Security

- **SHA-256 + salt** — password hashing on all stored credentials
- **XSS sanitization** — `escapeHTML()` applied to all user-generated content before DOM insertion
- **Session isolation** — `sessionStorage` used per tab to prevent cross-tab role conflicts
- **PIN-zone matching** — admin only receives orders whose delivery PIN falls in their configured service zones

---

## 📊 Order Lifecycle

```
Customer Places Order
        │
   ┌────▼────┐
   │ pending │
   └────┬────┘
        │  Admin confirms
   ┌────▼─────┐
   │confirmed │
   └────┬─────┘
        │  Admin starts packing
   ┌────▼────┐
   │ packing │
   └────┬────┘
        │  Rider assigned & picks up
   ┌────▼──────────┐
   │  on_the_way   │
   └────┬──────────┘
        │  Rider delivers
   ┌────▼──────┐
   │ delivered │  ✅
   └───────────┘

  * cancelled is reachable from: pending, confirmed, packing
```

---

## 🗺️ Geolocation & Zone Matching

When a customer places an order, MediiQuick uses a **3-tier priority matching** to route it to the right pharmacy admin:

1. **PIN + City match** — exact match on delivery PIN code and city (highest priority)
2. **City + Distance** — same city, within configured delivery radius (Haversine formula)
3. **GPS fallback** — nearest pharmacy by GPS coordinates if no PIN match found

Admins configure their serviceable PINs and delivery radius from the pharmacy profile section.

---

## ⚙️ Setup & Installation

### Prerequisites
- A modern browser (Chrome / Firefox / Edge)
- A local server to serve HTML files (e.g. VS Code Live Server)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/your-username/mediiquick.git
cd mediiquick

# 2. Open with VS Code Live Server
# Right-click index.html → Open with Live Server
```

That's it — no build step, no npm install, no bundler.

---

## 🧠 Key Implementation Details

- **No frontend framework** — pure vanilla JS with ES6 modules
- **Multi-tab safe** — `sessionStorage` per tab prevents cross-role session bleed
- **Dark mode** — shared `localStorage` key `mq_dark_mode`, respected across all pages
- **Input validation** — centralized in `utils/validators.js` (UPI format, required fields, field lengths)
- **Cart** — stored per user in `localStorage` (works offline, synced on order placement)
- **Earnings isolation** — filtered by pharmacy ID so each admin only sees their own revenue

---

## 📸 Pages at a Glance

| Page | Role | What it does |
|------|------|--------------|
| `index.html` | Customer | Medicine catalog, category browse, search, cart |
| `profile.html` | Customer | Address management, checkout, order placement |
| `my_order.html` | Customer | Order history, real-time status tracking |
| `adminpage.html` | Admin | Orders dashboard, inventory, rider requests |
| `pharmacy-earnings.html` | Admin | Revenue & earnings breakdown |
| `delivery-dashboard.html` | Rider | Live order broadcasts, accept/reject |
| `rider-wallet.html` | Rider | Earnings history, UPI payout request |
| `invoice.html` | Customer | Downloadable PDF invoice per order |
| `wishlist.html` | Customer | Saved/favourite medicines |
| `prescription-upload.html` | Customer | Upload & manage prescriptions |

---

## 🤝 Contributing

This is a college project but PRs are welcome! If you find a bug or want to add a feature:

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "feat: add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

Built with ❤️ as a college diploma project in Computer Science Engineering.  
Greater Noida, India.

By-VYADAW (Vishal yadaw) & Yuvraj Dixit

---

## 📄 License

This project is open source under the [MIT License](LICENSE).
