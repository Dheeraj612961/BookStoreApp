# 📚 BookNest — React Native Bookstore App

A fully functional, responsive mobile bookstore application built with **React Native** and **Expo**. BookNest provides a complete end-to-end shopping experience — from browsing and searching books to checkout and order confirmation.

---

## 📱 Screenshots & Features

### Home Page
- BookNest branded header with search bar, sign-in, and cart
- Animated hero banner with featured finance books
- Horizontal scrollable **New Releases** and **Best Sellers** sections
- Book cards with **press-to-scale animation**
- Pull-to-refresh support
- NavBar with category dropdown, What's New, Best Sellers, Coupons, Today's Deals

### Search Page
- Live search across title, author, and category
- **Category chip filters** (Fiction, Non-Fiction, Science, History, etc.)
- **Filter & Sort panel** (bottom-sheet modal) with:
  - Sort: Relevance / Price Low–High / Price High–Low / Highest Rated / Most Reviews
  - Price range: Under £5 / £5–£10 / £10–£15 / Over £15
  - Minimum rating: 3.5+ / 4.0+ / 4.5+
  - Book type: All / Sale / Best Seller
- **Active filter pills** with individual dismiss buttons
- Recent searches with one-tap recall
- Trending books horizontal carousel
- No-results state with clear-filters button

### Book Detail Page
- Large coloured book cover with discount badge
- Price, savings, stock status
- Quantity stepper (+ / −)
- Add to Cart (spring animation) + Buy Now
- Full features table (ISBN, publisher, dimensions, print length)
- Book description
- Delivery & returns info
- **Reviews & Ratings section**:
  - Star rating summary with breakdown bar chart
  - Individual review cards (name, avatar, stars, date, review text)
  - **Write a Review** modal with interactive star picker and 600-char text input
  - Live average rating recalculates after each new review
  - Requires sign-in to submit a review

### Cart Page
- Product table with coloured thumbnails, quantity controls, and delete
- Coupon code input (`BOOK10` = 10% off)
- Free shipping detection (orders over £10)
- Cart totals with shipment and total
- **Login gate** for guest users — prompts sign in before checkout

### Checkout Page
- Billing details form (name, company, country picker, address, city, postcode, phone, email)
- Order summary with book thumbnails and live total
- **Credit card payment** with:
  - Auto card type detection (VISA / Mastercard / AMEX from first digit)
  - Card number, expiry (MM/YY), CVV
  - 🔒 Encryption notice
- Full form validation with red-highlighted error fields
- Animated Place Order button with processing state

### Order Confirmation Page
- Animated green checkmark on mount
- Unique order number (e.g. `BW-482931`)
- Order summary with items and total paid
- Estimated delivery info
- Continue Shopping → Home

### Sign In / Sign Up
- Email + password with show/hide toggle
- Forgot password link
- Google / Apple sign-in stubs
- **Password strength meter** (Weak / Fair / Good / Strong)
- Terms & Conditions checkbox
- Seamless redirect back to checkout after login

---

## 🗂️ Project Structure

```
BookstoreApp/
├── App.js                          # Root — navigation + cart + auth state
├── app.json                        # Expo config
├── package.json
└── src/
    ├── data/
    │   └── books.js                # All book data (new releases, best sellers, hero)
    ├── components/
    │   ├── Header.js               # Top bar: logo, search, user, cart
    │   ├── NavBar.js               # Category dropdown + nav links
    │   ├── InfoBanner.js           # Shipping/guarantee info strip
    │   ├── HeroBanner.js           # Animated hero section
    │   └── BookSections.js         # New Releases + Best Sellers card grids
    └── screens/
        ├── HomeScreen.js           # Main landing page
        ├── SearchScreen.js         # Search with live filters
        ├── BookDetailScreen.js     # Product detail + reviews
        ├── CartScreen.js           # Shopping cart
        ├── CheckoutScreen.js       # Billing + payment
        ├── OrderConfirmScreen.js   # Order success
        ├── SignInScreen.js         # Login
        └── SignUpScreen.js         # Registration
```

---

## 🧭 Navigation Flow

```
Home
 ├── 🔍 Search bar → SearchScreen
 │    └── Book card → BookDetailScreen
 ├── 🗂️ NavBar category → SearchScreen (pre-filtered)
 ├── 📖 Book card → BookDetailScreen
 │    └── 🛒 Add to Cart → Cart badge updates
 └── 🛒 Cart icon → CartScreen
      └── Proceed to Checkout
           ├── [Guest] → SignInScreen → SignUpScreen
           │              └── Auto-redirect → CheckoutScreen
           └── [Logged in] → CheckoutScreen
                              └── Place Order → OrderConfirmScreen
                                               └── Continue Shopping → Home
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+
- [Expo Go](https://expo.dev/go) app on your mobile device

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd BookstoreApp

# Install dependencies
npm install
```

### Run on device (Expo Go)

```bash
# Same Wi-Fi network
npx expo start

# Different network (tunnel)
npx expo start --tunnel
```

Scan the QR code with:
- **Android**: Expo Go app → Scan QR code
- **iOS**: Native Camera app → tap the notification

### Run on Android emulator

```bash
# Start an AVD in Android Studio first, then:
npx expo start --android
```

---

## 📦 Build APK (Android)

### Using EAS Build (recommended — no Android Studio needed)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account (create one free at expo.dev)
eas login

# Configure build
eas build:configure

# Build APK
eas build -p android --profile preview
```

The build runs in Expo's cloud (~5–10 min). Download the `.apk` link when complete and install directly on your Android device.

> **Enable unknown sources**: Settings → Security → Install unknown apps → allow your browser/file manager

### Local build (requires Android Studio + JDK 17)

```bash
npx expo run:android
```

---

## 🧪 Test Credentials & Codes

| Feature | Value |
|---|---|
| Sign in | Any valid email + 6+ char password |
| Coupon code | `BOOK10` (10% discount) |
| Free shipping | Orders over **£10** |
| Card number | Any 16-digit number |
| VISA detection | Starts with `4` |
| Mastercard detection | Starts with `5` |
| AMEX detection | Starts with `3` |

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React Native | 0.86.3 | Mobile UI framework |
| Expo | ~57.0.23 | Build toolchain & dev server |
| React | 19.2.3 | UI library |
| JavaScript (ES2022) | — | Language |

**No external UI libraries** — all components are hand-built with React Native primitives (`View`, `Text`, `TouchableOpacity`, `Animated`, `Modal`, `FlatList`, `ScrollView`).

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary green | `#1B6B2F` |
| Orange accent | `#F57C00` |
| Error red | `#D32F2F` |
| Background | `#F8F9FA` |
| Card surface | `#FFFFFF` |
| Muted text | `#777777` |
| Font weight headings | `800` / `900` |

---

## 📋 Features Checklist

- [x] Home page with hero banner and book sections
- [x] NavBar with category navigation
- [x] Search with live filtering, sort, price range, rating filter
- [x] Book detail page with features table and description
- [x] Reviews & ratings with breakdown chart and write-review modal
- [x] Cart with quantity controls, coupon codes, free shipping detection
- [x] Checkout with billing form + credit card payment
- [x] Order confirmation with animated checkmark
- [x] Sign In / Sign Up with password strength meter
- [x] Auth gate — checkout requires login
- [x] Scale animations on book cards
- [x] Pull-to-refresh on home
- [x] Safe area handling (no camera/notch overlap)
- [x] Responsive layout (works on all Android screen sizes)

---

## 📄 License

MIT — free to use and modify.

---

*Built with ❤️ using React Native & Expo*
