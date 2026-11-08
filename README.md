# 🧌 GoblinPay
### Split the bill. Settle the score. Feed the Goblin.

GoblinPay is an AI-powered social expense-splitting application that makes managing shared expenses easier, smarter, and more fun.

Forget manually calculating everyone's share after a night out. GoblinPay combines AI-powered receipt scanning, smart bill splitting, Solana payments, and gamification to transform how friends manage shared expenses.

---

## ✨ What is GoblinPay?

Imagine going out for dinner with your friends.

One person uploads the receipt. GoblinPay uses Gemini AI to extract the items and their prices. Everyone selects what they ordered, and the application calculates how much each person owes.

Friends can connect their Phantom wallets and settle their shares using Solana Devnet.

And if someone keeps delaying their payment?

The Goblin remembers. 👀

---

## 🚀 Features

### 🧾 AI-Powered Receipt Scanning
- Upload restaurant receipts.
- Use Google's Gemini API to extract receipt information.
- Identify items, prices, and totals.
- Review and correct extracted information before splitting.

### 💸 Smart Bill Splitting
- Assign individual items to friends.
- Calculate each person's share.
- Distribute shared expenses.
- Handle monetary calculations using integer-based currency values for accuracy.

### ⚡ Solana Payments
- Connect Phantom wallets.
- Send SOL transactions on Solana Devnet.
- Request explicit wallet approval before transactions.
- Confirm transactions on the blockchain.

### 🧌 Goblin Dare Mode
- Daily challenges and activities.
- Goblin XP and achievements.
- Competitive leaderboards.
- Fun incentives for settling shared expenses.

### 🎮 Gamified Experience
GoblinPay turns everyday expense management into a social experience with challenges, rewards, and a little friendly competition.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend application |
| TypeScript | Type-safe development |
| Vite | Development and build tooling |
| Tailwind CSS | Styling |
| Node.js | Backend runtime |
| Express.js | Backend API |
| Google Gemini API | AI receipt processing |
| Solana Devnet | Blockchain transactions |
| Phantom Wallet | Wallet connection and transaction approval |
| Lucide React | Icons |

---

## 🏗️ How It Works

1. **Create a group:** Start a shared expense group with friends.
2. **Upload a receipt:** Add a receipt image.
3. **AI processes it:** Gemini extracts the items and prices.
4. **Split the bill:** Assign items to the people who ordered them.
5. **Connect wallets:** Friends connect their Phantom wallets.
6. **Settle expenses:** Send SOL through Solana Devnet.
7. **Earn rewards:** Participate in Goblin challenges and earn XP.

---

## 🔐 Security Considerations

- Solana Devnet is used for testing, not real-money payments.
- Users review AI-extracted receipt information before splitting.
- Gemini does not access wallet private keys or sign transactions.
- Phantom requires user approval for transactions.
- Payment status should be based on verified blockchain confirmations.

---

## 💻 Getting Started

### Prerequisites

- Node.js and npm
- Git
- Phantom Wallet browser extension
- A Solana Devnet wallet
- Gemini API key

### Installation

Clone the repository:

```bash
git clone https://github.com/akssssO/GoblinPay.git
cd GoblinPay
```

Install frontend dependencies:

```bash
npm install
```

Configure your environment variables using your project's existing environment configuration.

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

**Backend:** Start the Node.js/Express server using the scripts defined in your backend's `package.json`.

---

## 🏆 Built for the Solana Hackathon

GoblinPay explores how AI and blockchain can work together to make everyday financial interactions more engaging.

By combining Gemini-powered receipt processing with Solana-based payments, we aim to make splitting expenses between friends simpler, more transparent, and more enjoyable.

---

## 👾 The Goblin Philosophy

**Split fairly. Pay quickly. Never escape the Goblin.**

Made with curiosity, code, AI, and a little goblin chaos. 🧌

