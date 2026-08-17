# 🚀 Brand Funnel

> **Precision 5-Stage Domain & Social Identity Intelligence Engine**
> Verify candidate brand names through an automated cascading funnel: domain registry availability first, then surviving names across Instagram, YouTube, Twitter/X, and Facebook in real-time.

---

## ✨ Features

- **⚡ Early-Stop Cascading Architecture**: Discards candidate names that fail domain registration at Stage 1 before querying social media APIs, preventing rate-limits and saving 75%+ of API calls.
- **🌐 Dual-Engine Verification**:
  - **Official GoDaddy v3 API**: Live authoritative registry lookup and pricing.
  - **Authoritative DNS-over-HTTPS (DoH) Fallback**: Seamless fallback to Google & Cloudflare DoH and ICANN RDAP with zero configuration when rate limits are met.
- **📱 Multi-Platform Social Availability**: Live handle checks for Instagram (`@handle`), YouTube Channel (`/@handle`), Twitter/X (`@handle`), and Facebook (`/handle`).
- **🛡️ 100% Client-Side Privacy**: All checks run locally in the browser via Vite proxy. Zero central logging, zero telemetry, no tracking cookies.
- **🎨 2026 Design System**:
  - Precision Dark & High-Contrast Porcelain Light modes.
  - Bespoke SVG vector icons (100% emoji-free).
  - Silky scroll reveal animations, interactive sandbox simulation, and responsive mobile architecture.
- **📊 1-Click Shortlist Export**: Export surviving all-clear candidates with live registry prices to formatted CSV files.

---

## 🏗️ Architecture

```
Candidate Brand Names (Batch Input)
                │
                ▼
      ┌──────────────────┐
      │  Stage 1: Domain │ ──(Taken)──► [Pruned & Filtered]
      │  Registry Check  │
      └─────────┬────────┘
                │ (Available Survivors)
                ▼
      ┌──────────────────┐
      │ Stage 2: @Insta  │ ──(Taken)──► [Marked Taken / Profile Link]
      └─────────┬────────┘
                │ (Surviving Names)
                ▼
      ┌──────────────────┐
      │ Stage 3: YouTube │
      └─────────┬────────┘
                │ (Surviving Names)
                ▼
      ┌──────────────────┐
      │ Stage 4: Twitter │
      └─────────┬────────┘
                │ (Surviving Names)
                ▼
      ┌──────────────────┐
      │ Stage 5: Facebook│
      └─────────┬────────┘
                │
                ▼
   🏆 ALL-CLEAR BRAND SURVIVORS
```

---

## 🛠️ Quickstart

### Prerequisites
- Node.js (v18+)
- npm or pnpm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/insanebwoi/brandfunnel.git

# Navigate into project directory
cd brandfunnel

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be running at `http://localhost:3092/`.

---

## 🔑 GoDaddy API Configuration (Optional)

1. Generate a free Personal Access Token (PAT) from [developer.godaddy.com](https://developer.godaddy.com/keys).
2. Click **Settings / Config** in the top right of the app.
3. Paste your token under **GoDaddy PAT Key**.
4. If omitted, the engine automatically runs in **Authoritative DNS-over-HTTPS (DoH)** mode.

---

## 📦 Build for Production

```bash
npm run build
```

---

## 📄 License

MIT License. Designed and engineered for modern founders, domainers, and brand builders.
