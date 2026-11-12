# KRISHI-NIRNAY AI (Mandi Mitra)
### Smart Agricultural Decision Support & B2B Marketplace Platform
**Prepared for Tech4Bharat 2026 Problem Statement 6.1: *Farmers sell at the wrong time, place and price.***

---

## 🌟 Executive Overview & Core Value Proposition

Small and marginal farmers often suffer significant losses because they lack transparent, timely market intelligence and sell under distress. Conventional apps merely show modal mandi prices without considering the real-world trade-offs:

> **Core Promise:**
> *"Find the selling option that may give the farmer the best realistic net return — after market price, transport, storage, and spoilage are considered."*

KRISHI-NIRNAY AI solves this by introducing a **deterministic, auditable profit-optimization engine**, coordinated by **six specialist AI agents**, with a **voice-first multilingual interface** in 10 Indian languages, and comprehensive portals for **Farmers**, **Buyers**, and **FPOs**.

---

## 🏗️ 6-Agent AI Architecture (Slide 3 Mapping)

The application employs an auditable, deterministic agentic architecture where money calculations are strictly reproducible and never hallucinated:

```
                  ┌───────────────────────────────┐
                  │    Farmer Assistant Agent     │
                  │   (Voice & Multilingual NLP)  │
                  └───────────────┬───────────────┘
                                  │
                  ┌───────────────▼───────────────┐
                  │   Profit Optimization Agent   │
                  │ (Auditable Net Return Engine) │
                  └───────┬───────────┬───────────┘
                          │           │
       ┌──────────────────┼───────────┼──────────────────┐
       │                  │           │                  │
┌──────▼──────┐    ┌──────▼─────┐ ┌───▼────────┐  ┌──────▼──────┐
│   Market    │    │Price Trend │ │ Transport  │  │  Storage &  │
│Intelligence │    │   Agent    │ │   Agent    │  │Spoilage Agt │
└─────────────┘    └────────────┘ └────────────┘  └─────────────┘
```

1. **Market Intelligence Agent (`MarketAgent`)**:
   - Validates live and official APMC mandi rates (e.g. Bengaluru Rural, Kolar, Hosur, Ramanagara).
   - Labels source data freshness (e.g., "Updated Today 8:45 AM") and tracks distance.

2. **Price Trend Agent (`TrendAgent`)**:
   - Analyzes historical modal price movements across 1W, 1M, 3M, 6M, and 1Y timeframes.
   - Generates forecast ranges with explicit **uncertainty ratings** (Low/Medium/High) and safety disclaimers.

3. **Transport Agent (`TransportAgent`)**:
   - Calculates freight costs by vehicle type (3-Wheeler Auto, Tata Ace Mini-Truck, 3-Tonne Canter, or FPO Pooled Truck).
   - Details route distances, base fares, and fuel rates.

4. **Storage & Spoilage Agent (`StorageAgent`)**:
   - Calculates storage expenses (`Quantity × Days × Rate/kg/day`).
   - Models perishability decay curves (e.g., Tomato: 8%/day ambient vs. 0.5%/day cold storage; Grains: 0.05%/day).

5. **Profit Optimization Agent (`OptimizationAgent`)**:
   - Runs deterministic net return comparisons:
     $$\text{Net Return} = (\text{Quantity} \times (1 - \text{Spoilage Risk})) \times \text{Forecast Price} - \text{Transport} - \text{Storage}$$
   - Respects farmer constraints: **"Urgent cash needed"** automatically prioritizes immediate liquidation at the highest-margin local mandi today.

6. **Farmer Assistant Agent (`AssistantAgent`)**:
   - Translates calculations into clear regional-language explanations and provides voice synthesis.

---

## 📱 Dual Experience: Desktop Portal + Mobile Phone Simulation

KRISHI-NIRNAY AI supports both operating models out of the box with a single click:

- **🖥️ Desktop Web / Laptop Portal (Slides 11–23, 24–35)**:
  - Full-screen dashboard for FPO coordinators, agricultural support teams, and progressive farmers.
  - Multi-column tables, SVG historical trend charts, detailed log sheets, and role-based views.
- **📱 Mobile App Simulation (Slides 1, 5–9)**:
  - Realistic smartphone bezel with status bar (`9:41`, 5G, battery), notch, bottom tab navigation bar, and floating voice microphone.

---

## 🇮🇳 Multilingual in 10 Indian Regional Languages

Full UI translations and speech compatibility for:
1. **English**
2. **हिन्दी (Hindi)**
3. **ಕನ್ನಡ (Kannada)**
4. **தமிழ் (Tamil)**
5. **తెలుగు (Telugu)**
6. **मराठी (Marathi)**
7. **বাংলা (Bangla)**
8. **ગુજરાતી (Gujarati)**
9. **മലയാളം (Malayalam)**
10. **ଓଡ଼ିଆ (Odia)**

---

## 🚀 Key Modules & Capabilities

### 1. Sell vs. Wait Decision Simulator (Slides 4, 17, 18)
- Real-time sliders for crop quantity, wait days, cold storage access, and urgent cash needs.
- Side-by-side cards comparing **Sell Today** vs. **Wait & Store**, revealing exact net return differences.

### 2. Live Market Comparison & Distance Routing (Slides 6, 13, 19)
- Compare multiple nearby APMC mandis.
- Shows modal price, distance (km), transit cost, and net return.

### 3. Price Prediction & Historical Trends (Slides 9, 14, 15)
- Interactive SVG charts showing 6-month modal price trajectories.
- 7-day projected price corridors with medium uncertainty badges.

### 4. My Crops & Harvest Tracking (Slides 8, 16)
- Readiness stepper: **Growing ➔ Ready ➔ Harvested**.
- Timely reminders to inspect market prices 5 days before picking.

### 5. B2B Buyer Marketplace (Slides 24–28, 34)
- **Produce Listing**: Post crops with photos, grade (A/B/C), and asking price.
- **Offer Comparison & Counter-offers**: Compare buyer bids by net return after transport, negotiate or accept.

### 6. Orders, Milestone Tracking & Payment Escrow (Slides 29, 30)
- 4-stage tracking: Offer Accepted ➔ Pickup Scheduled ➔ Produce Dispatched ➔ Buyer Verified.
- Transparent payment breakdown: Advance paid, delivery balance held in escrow, printable APMC transaction receipts.

### 7. FPO Collective Aggregation (Slides 20, 35)
- Pools produce from 24 member farmers (e.g., 6,200 kg pooled).
- Shared logistics optimizer: saves **₹7,200 (46%)** in transit costs by replacing scattered individual vehicles with pooled freight.

### 8. Weather Alerts & APMC Disputes (Slides 32, 33)
- 48-hour rain advisories, storage ventilation alerts, route blockage notifications.
- Integrated dispute filing for payment delays or weighment disagreements.

---

## 💻 How to Run

KRISHI-NIRNAY AI is built as a zero-dependency, high-performance web application that runs directly in any modern browser:

### Option 1: Quick Launch (Windows)
Double-click `run.bat` or run:
```cmd
run.bat
```

### Option 2: Direct File Open
Open `d:\mandi mitra\index.html` in **Google Chrome**, **Microsoft Edge**, or **Brave Browser**.

---

## 🛡️ Trust, Safety and Transparency Principles (Slide 7)
- **Data Freshness**: Source timestamp displayed on every screen.
- **Estimate Transparency**: Distinguishes verified live data from algorithmic projections.
- **Farmer in Control**: The AI provides actionable decision support; the farmer always makes the final call.
