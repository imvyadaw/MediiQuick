Here's the updated `README.md` file with all the requested information:

```markdown
# MediiQuick — Medicine Delivery Platform

## 📌 Project Overview

**MediiQuick** is a complete medicine delivery platform connecting **customers**, **pharmacy admins**, and **delivery riders** in one unified system. Built with pure HTML/CSS/JS and Firebase as the backend, the platform enables 30-minute medicine delivery with real-time order tracking, GPS-based pharmacy assignment, and rider management.

---

## 🚀 Live Demo

> *(Add your hosted link here)*

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     MediiQuick Platform                      │
├───────────────┬───────────────────┬─────────────────────────┤
│   Customers   │  Pharmacy Admins   │    Delivery Riders       │
│   (index.html)│  (adminpage.html)  │  (delivery-dashboard.html)│
└───────────────┴───────────────────┴─────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │     Firebase       │
                    │  ┌─────────────┐   │
                    │  │ Firestore   │   │
                    │  │   DB        │   │
                    │  └─────────────┘   │
                    │  ┌─────────────┐   │
                    │  │ Firebase    │   │
                    │  │   Auth      │   │
                    │  └─────────────┘   │
                    └─────────────────────┘
```

---

## 👥 User Roles & Features

### 1. 🛒 Customers (`index.html`, `profile.html`, `my_order.html`)

| Feature | Description |
|---------|-------------|
| **Medicine Search** | Search by name, category, or keywords |
| **Category Browsing** | Browse by Fever, Allergy, Heart Care, Diabetes, etc. |
| **Shopping Cart** | Add/remove items, update quantities |
| **Checkout** | Multiple payment options (UPI, Card, Net Banking, COD) |
| **Order Tracking** | Real-time order status with ETA |
| **Address Management** | Save multiple delivery addresses |
| **Order History** | View past orders with details |
| **Profile Management** | Update name, email, phone, password |
| **GPS Location** | Auto-detect delivery location |

### 2. 🏥 Pharmacy Admins (`adminpage.html`)

| Feature | Description |
|---------|-------------|
| **Dashboard** | Real-time stats: orders, medicines, revenue, deliveries |
| **Medicine Management** | Add/Edit/Delete medicines, bulk import via CSV |
| **Category Management** | Create custom categories with icons |
| **Order Management** | View all orders, update status, assign riders |
| **Delivery Boys** | Add/Edit/Delete riders, track availability |
| **Customer Management** | View customer profiles and order history |
| **Analytics** | Sales reports, top medicines, revenue summary |
| **Profile Settings** | Update pharmacy info, delivery radius, served PIN codes |
| **Real-time Sync** | Orders update automatically via Firestore |

### 3. 🏍️ Delivery Riders (`delivery-dashboard.html`, `delivery-signup.html`)

| Feature | Description |
|---------|-------------|
| **Rider Registration** | Sign up with phone, vehicle type, city, PIN |
| **GPS Tracking** | Share live location for order assignment |
| **Order Requests** | Receive real-time delivery requests |
| **Accept/Reject** | Accept or reject orders within timeout |
| **Mark Delivered** | Complete deliveries and update status |
| **Profile Management** | Edit details, change password |
| **Availability Toggle** | Go online/offline for orders |
| **Earnings Stats** | Track total deliveries and active orders |

---

## 📁 File Structure

```
MediiQuick/
├── index.html              # Customer landing page
├── profile.html            # Customer dashboard (shop, cart)
├── my_order.html           # Customer order tracking
├── myprofile.html          # Customer profile management
├── login.html              # Unified login (User/Admin/Rider)
├── signupuser.html         # Customer registration
├── signup.html             # Pharmacy admin registration
├── adminpage.html          # Pharmacy admin dashboard
├── delivery-dashboard.html # Rider dashboard
├── delivery-signup.html    # Rider registration
├── firebase-config.js      # Firebase configuration
├── utils.js                # Shared utilities
└── images/                 # Product images
```

---

## 🗄️ Firebase Collections

| Collection | Purpose | Key Fields |
|------------|---------|------------|
| `users` | Customer data | name, email, mobile, lat, lng, address |
| `admins` | Pharmacy admin data | shopName, email, mobile, city, servedPins, deliveryRadius, password |
| `pharmacyProfiles` | Pharmacy settings | city, servedPins, deliveryRadius, lat, lng |
| `riders` | Delivery riders | name, phone, vehicle, city, deliveryRange, status, lat, lng |
| `medicines` | Medicine inventory | name, category, catKey, quantity, price |
| `customCategories` | Custom categories | key, label, icon, color |
| `orders` | Customer orders | orderId, items, total, status, deliveryAddr, assignedAdminId |
| `riderRequests` | Rider assignment requests | orderId, riderIds, acceptedBy, expiresAt |
| `carts` | Saved carts | items, updatedAt |
| `userAddresses` | Saved addresses | name, phone, street, city, pin |

---

## 🔐 Authentication

| Role | Login Method | Credentials |
|------|--------------|-------------|
| Customer | Firebase Auth (Email/Password) | Email + Password |
| Pharmacy Admin | Firestore + Firebase Auth | Admin ID/Email + Password |
| Rider | Firestore + Firebase Auth (synthetic email) | Phone + Password |

---

## 🧠 Key Business Logic

### Pharmacy Assignment (PIN + City Validation)

```
Order → Delivery PIN → India Post API → Real City
                                    ↓
                    Match with pharmacy's servedPins + city
                                    ↓
                        Assign to matching pharmacy
```

**Critical Fix:** Orders are only assigned if BOTH PIN code AND real city match the pharmacy's served area. Prevents misassignment.

### Order Status Flow

```
Pending → Confirmed → Packing → On the Way → Delivered
                    ↓
            Rider Request (10 min timeout)
                    ↓
         Accepted → On the Way
         Rejected by all → Cancelled
```

### Real-time Updates

- Firestore `onSnapshot()` listeners for orders, medicines, categories
- Live dashboard updates without page refresh
- Rider request popup with countdown timer

---

## 📱 Responsive Design

- Mobile-first approach using CSS Grid/Flexbox
- Breakpoints: 480px, 600px, 768px, 1100px
- Touch-friendly buttons and inputs
- Cart drawer slides from right on mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Backend | Firebase Firestore (NoSQL) |
| Authentication | Firebase Auth |
| APIs | India Post PIN Code API, OpenStreetMap Nominatim |
| Hosting | Firebase Hosting / Any static host |
| Icons | Font Awesome 6 |
| Fonts | Google Fonts (Poppins, Inter) |

---

## 🚦 Getting Started

### Prerequisites
- Firebase account
- Node.js (optional, for local server)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mediiquick.git
   cd mediiquick
   ```

2. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project
   - Enable Email/Password authentication
   - Create Firestore database (start in test mode)

3. **Update Firebase Config**
   - Copy your Firebase config from Project Settings
   - Replace config in `firebase-config.js`

4. **Deploy Firestore Security Rules**
   ```javascript
   // Example rules (customize as needed)
   match /orders/{orderId} {
     allow read: if request.auth != null;
     allow write: if request.auth != null;
   }
   ```

5. **Run Locally**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using VS Code Live Server
   # Right-click index.html → Open with Live Server
   ```

---

## 🔧 Environment Variables

Create a `.env` file (for production) or update directly in `firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## 🧪 Testing Accounts

| Role | Email/ID | Password |
|------|----------|----------|
| Customer | test@example.com | Test@123 |
| Admin | admin@pharmacy.com | Admin@123 |
| Rider | 9876543210 | Rider@123 |

> *Register new accounts via signup pages*

---

## 📊 Database Schema

### orders collection
```javascript
{
  orderId: "MQ12345678",
  customerName: "John Doe",
  customerEmail: "john@example.com",
  items: [{ med: {...}, qty: 2 }],
  total: 250,
  status: "pending|confirmed|packing|on_the_way|delivered|cancelled",
  placedAt: 1700000000000,
  deliveryAddr: { street, city, pin, lat, lng },
  assignedAdminId: "ADMIN123",
  deliveryBoy: { id, name, phone }
}
```

### medicines collection
```javascript
{
  id: 1,
  name: "Dolo 650",
  category: "Fever & Pain",
  catKey: "fever",
  quantity: 100,
  price: 25
}
```

---

## 🐛 Known Issues & Fixes

| Issue | Fix |
|-------|-----|
| Orders assigned to wrong pharmacy | Added PIN + real city validation via India Post API |
| Rider request timeout not working | Fixed 10-minute expiration timer |
| Cart not syncing across devices | Implemented Firestore cart sync |
| Out of stock showing incorrectly | Added `outOfStock` flag based on quantity=0 |

---

## 📈 Future Enhancements

- [ ] Push notifications for order updates
- [ ] Razorpay/Paytm payment gateway integration
- [ ] Pharmacy earnings dashboard with payouts
- [ ] Rider earnings tracking and withdrawal
- [ ] Prescription upload for medicines
- [ ] Chat support between customer and pharmacy
- [ ] Loyalty points and referral system
- [ ] Admin panel for platform management

---

## 👨‍💻 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Firebase](https://firebase.google.com/) for backend services
- [Font Awesome](https://fontawesome.com/) for icons
- [India Post API](https://api.postalpincode.in/) for PIN validation
- [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/) for geocoding

---

## 📞 Support

For support, email support@mediiquick.com or raise an issue in the GitHub repository.

---

**Made with ❤️ for faster medicine delivery**
```