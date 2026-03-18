# 💊 MediiQuick — Medicine Delivery in 30 Minutes

> A complete frontend-only pharmacy delivery web app built with pure HTML, CSS & JavaScript. No framework, no backend — runs entirely in the browser using localStorage.

---

## 📁 Project Structure

```
mediiquick/
├── index.html          # Homepage — browse & order medicines
├── profile.html        # User dashboard — cart, orders, profile
├── login.html          # User + Admin login (tabbed)
├── signup.html         # User registration
├── signupuser.html     # Extended user signup flow
├── myprofile.html      # User profile editor
├── my_order.html       # Order tracking page
├── adminpage.html      # Admin dashboard (medicines, orders, analytics)
├── admin-login.html    # Dedicated admin login page
└── admin-signup.html   # Pharmacy partner registration
```

---

## ⚙️ Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Structure |
| CSS3 | Styling & animations |
| Vanilla JavaScript | All logic & interactivity |
| localStorage | Data storage (no backend) |
| Google Fonts — Poppins | Typography |
| Font Awesome 6.4 | Icons |
| Unsplash | Medicine & tip images |

---

## 🚀 How to Run

```bash
# Option 1 — Python server (recommended)
python -m http.server 8000
# Open: http://127.0.0.1:8000

# Option 2 — Direct browser
# Just open index.html in any browser
```

---

## 👤 User Flow

```
index.html  →  Login/Signup  →  profile.html
                                    ↓
                          Browse categories
                          Search medicines
                          Add to cart
                          Place order
                          Track order
```

## 🏥 Admin Flow

```
admin-signup.html  →  admin-login.html  →  adminpage.html
                                               ↓
                                     Manage medicines
                                     Bulk CSV import
                                     Manage orders
                                     Manage delivery boys
                                     View analytics
```

---

## 📦 localStorage Keys

| Key | Description |
|---|---|
| `mq_user` | Logged-in user session |
| `mq_users` | All registered users |
| `mq_admin` | Admin account data |
| `mq_admin_session` | Admin login session |
| `mq_admin_medicines` | Medicine inventory |
| `mq_custom_categories` | Admin-created categories |
| `mq_medicines_updated` | Last sync timestamp |
| `mq_orders` | All orders |
| `mq_addresses` | User saved addresses |
| `mq_delivery_boys` | Delivery boy records |
| `mq_pharmacy_profile` | Pharmacy info |
| `mq_reset_otp` | Password reset OTP |

---

## ✨ Key Features

### Customer Side
- Browse medicines by category
- Search medicines
- Add to cart & place order
- COD / UPI / Card payment options
- Order tracking
- Save multiple delivery addresses
- User login & signup

### Admin Side
- Medicine inventory management
- **Bulk medicine import via CSV**
- Custom category creation
- Order management & status updates
- Delivery boy assignment
- Sales analytics
- Pharmacy profile settings
- Low stock alerts

---

## 📋 Bulk Medicine Import (CSV Format)

```csv
Name,Quantity,Price
Paracetamol 500mg,100,18
Dolo 650,80,25
Cetirizine 10mg,50,20
```

**Steps:** Admin Dashboard → Medicines → Bulk Import → Select Category → Paste CSV → Import

---

## ⚠️ Important Note

This project uses **localStorage** for all data storage. This means:
- Data is **browser & device specific**
- Data does **not sync** across multiple devices
- For multi-device sync, a backend (Firebase / Django) is needed

---

## 🔐 Auth System

- **User login** — Email + Password (stored in `mq_users`)
- **Admin login** — Email or Admin ID + Password (stored in `mq_admin`)
- **Protected pages** — Redirect to login if session missing
- **Forgot Password** — OTP generated locally, shown on screen

---

## 📱 Pages Overview

| Page | Access | Purpose |
|---|---|---|
| `index.html` | Public | Homepage, browse medicines |
| `profile.html` | User login required | Shop, cart, orders |
| `login.html` | Public | User + Admin login |
| `signup.html` | Public | New user registration |
| `my_order.html` | User login required | Order history & tracking |
| `myprofile.html` | User login required | Edit profile |
| `adminpage.html` | Admin login required | Full admin dashboard |
| `admin-login.html` | Public | Admin-only login |
| `admin-signup.html` | Public | Pharmacy registration |

---

*Built with ❤️ — MediiQuick*
