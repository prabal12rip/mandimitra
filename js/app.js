/**
 * KRISHI-NIRNAY AI (Mandi Mitra)
 * Main Application Controller & View Routing
 * Fully integrated with Government Portals (Agmarknet, CACP, NHB) & Live Google Gemini AI
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Core Systems
  const data = window.KRISHI_DATA;
  const coordinator = new KrishiAgentCoordinator(data);
  const govtDataService = window.govtDataService || new GovtDataService();
  const krishiAiEngine = new KrishiAiEngine(coordinator, govtDataService);
  window.krishiAiEngine = krishiAiEngine;

  const voiceEngine = new VoiceEngine(coordinator);
  const marketplace = new MarketplaceEngine(data, coordinator);
  const fpoEngine = new FPOEngine(data);

  // Expose to window for inline onclick handlers
  window.app = {
    data,
    coordinator,
    govtDataService,
    krishiAiEngine,
    voiceEngine,
    marketplace,
    fpoEngine,
    currentView: "dashboard",
    currentRole: "farmer", // farmer | buyer | fpo
    viewMode: "desktop",    // desktop | mobile
    activeCropId: "tomato",
    activeTimeRange: "6M",
    activeGovtTab: "agmarknet",

    // Navigation
    navigate(viewName) {
      this.currentView = viewName;
      document.querySelectorAll(".view-panel").forEach(panel => {
        panel.classList.remove("active");
      });
      const activeEl = document.getElementById(`view-${viewName}`);
      if (activeEl) {
        activeEl.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      // Update active nav links
      document.querySelectorAll(".sidebar-nav-link, .mobile-tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.view === viewName);
      });

      // Refresh view-specific components
      if (viewName === "price-prediction" || viewName === "market-prices") {
        this.renderPriceChart();
      } else if (viewName === "sell-vs-wait") {
        this.updateSellVsWaitCalculation();
      } else if (viewName === "fpo-dashboard") {
        this.renderFPODashboard();
      } else if (viewName === "buyer-marketplace") {
        this.renderMarketplaceListings();
      } else if (viewName === "orders-tracking") {
        this.renderOrders();
      } else if (viewName === "my-crops") {
        this.renderMyCrops();
      } else if (viewName === "govt-data-hub") {
        this.renderGovtDataHub();
      }
    },

    // Role Switcher
    setRole(role) {
      this.currentRole = role;
      document.querySelectorAll(".role-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.role === role);
      });
      
      const roleBadge = document.getElementById("header-user-role");
      if (roleBadge) {
        if (role === "farmer") roleBadge.innerText = "Farmer • Doddaballapur";
        else if (role === "buyer") roleBadge.innerText = "Verified Buyer • ABC Foods";
        else if (role === "fpo") roleBadge.innerText = "FPO Coordinator • Doddaballapur";
      }

      if (role === "buyer") {
        this.navigate("buyer-portal");
      } else if (role === "fpo") {
        this.navigate("fpo-dashboard");
      } else {
        this.navigate("dashboard");
      }
      this.renderSidebarMenu();
    },

    // View Mode Switcher
    setViewMode(mode) {
      this.viewMode = mode;
      const appContainer = document.getElementById("app-root-container");
      const toggleBtn = document.getElementById("view-mode-toggle-btn");

      if (mode === "mobile") {
        appContainer.classList.add("mobile-frame-active");
        if (toggleBtn) toggleBtn.innerHTML = `<span>🖥️</span> <span>${I18N.t("switchToDesktop")}</span>`;
      } else {
        appContainer.classList.remove("mobile-frame-active");
        if (toggleBtn) toggleBtn.innerHTML = `<span>📱</span> <span>${I18N.t("switchToMobile")}</span>`;
      }
    },

    toggleViewMode() {
      this.setViewMode(this.viewMode === "desktop" ? "mobile" : "desktop");
    },

    // Language Selector
    setLanguage(langCode) {
      I18N.setLang(langCode);
      const langSelect = document.getElementById("global-language-select");
      if (langSelect) langSelect.value = langCode;
      this.updateDynamicTranslations();
    },

    updateDynamicTranslations() {
      I18N.updateDOM();
      this.renderRecommendationCard();
    },

    // Render Dynamic Sidebar based on role
    renderSidebarMenu() {
      const sidebarNav = document.getElementById("sidebar-menu-links");
      if (!sidebarNav) return;

      if (this.currentRole === "buyer") {
        sidebarNav.innerHTML = `
          <button class="sidebar-nav-link" data-view="buyer-portal" onclick="app.navigate('buyer-portal')">
            <span class="icon">🏢</span> <span data-i18n="buyerDashboard">Buyer Dashboard</span>
          </button>
          <button class="sidebar-nav-link" data-view="govt-data-hub" onclick="app.navigate('govt-data-hub')">
            <span class="icon">🏛️</span> <span>Govt Agri Data Hub</span>
          </button>
          <button class="sidebar-nav-link" data-view="market-prices" onclick="app.navigate('market-prices')">
            <span class="icon">📊</span> <span data-i18n="marketPrices">Market Prices</span>
          </button>
          <button class="sidebar-nav-link" data-view="buyer-marketplace" onclick="app.navigate('buyer-marketplace')">
            <span class="icon">🛒</span> <span>Browse Produce</span>
          </button>
          <button class="sidebar-nav-link" data-view="orders-tracking" onclick="app.navigate('orders-tracking')">
            <span class="icon">📦</span> <span>Active Orders</span>
          </button>
          <button class="sidebar-nav-link" data-view="settings" onclick="app.navigate('settings')">
            <span class="icon">⚙️</span> <span data-i18n="settings">Settings</span>
          </button>
        `;
      } else if (this.currentRole === "fpo") {
        sidebarNav.innerHTML = `
          <button class="sidebar-nav-link" data-view="fpo-dashboard" onclick="app.navigate('fpo-dashboard')">
            <span class="icon">🤝</span> <span data-i18n="fpoDashboard">FPO Aggregation</span>
          </button>
          <button class="sidebar-nav-link" data-view="govt-data-hub" onclick="app.navigate('govt-data-hub')">
            <span class="icon">🏛️</span> <span>Govt Agri Data Hub</span>
          </button>
          <button class="sidebar-nav-link" data-view="market-prices" onclick="app.navigate('market-prices')">
            <span class="icon">📊</span> <span data-i18n="marketPrices">Mandi Prices</span>
          </button>
          <button class="sidebar-nav-link" data-view="storage-transport" onclick="app.navigate('storage-transport')">
            <span class="icon">🚚</span> <span>Group Logistics</span>
          </button>
          <button class="sidebar-nav-link" data-view="buyer-marketplace" onclick="app.navigate('buyer-marketplace')">
            <span class="icon">🛒</span> <span>Bulk Buyer Offers</span>
          </button>
          <button class="sidebar-nav-link" data-view="settings" onclick="app.navigate('settings')">
            <span class="icon">⚙️</span> <span data-i18n="settings">Settings</span>
          </button>
        `;
      } else {
        // Farmer Menu
        sidebarNav.innerHTML = `
          <button class="sidebar-nav-link active" data-view="dashboard" onclick="app.navigate('dashboard')">
            <span class="icon">🏠</span> <span data-i18n="dashboard">Dashboard</span>
          </button>
          <button class="sidebar-nav-link" data-view="govt-data-hub" onclick="app.navigate('govt-data-hub')">
            <span class="icon">🏛️</span> <span>Govt Agri Data Hub</span>
          </button>
          <button class="sidebar-nav-link" data-view="market-prices" onclick="app.navigate('market-prices')">
            <span class="icon">📊</span> <span data-i18n="marketPrices">Market Prices</span>
          </button>
          <button class="sidebar-nav-link" data-view="price-prediction" onclick="app.navigate('price-prediction')">
            <span class="icon">📈</span> <span data-i18n="pricePrediction">Price Prediction</span>
          </button>
          <button class="sidebar-nav-link" data-view="sell-vs-wait" onclick="app.navigate('sell-vs-wait')">
            <span class="icon">⚖️</span> <span data-i18n="sellVsWait">Sell vs Wait</span>
          </button>
          <button class="sidebar-nav-link" data-view="storage-transport" onclick="app.navigate('storage-transport')">
            <span class="icon">🚚</span> <span data-i18n="storageTransport">Storage & Transport</span>
          </button>
          <button class="sidebar-nav-link" data-view="my-crops" onclick="app.navigate('my-crops')">
            <span class="icon">🌱</span> <span data-i18n="myCrops">My Crops</span>
          </button>
          <button class="sidebar-nav-link" data-view="buyer-marketplace" onclick="app.navigate('buyer-marketplace')">
            <span class="icon">🛒</span> <span data-i18n="buyerMarketplace">Find Buyers</span>
          </button>
          <button class="sidebar-nav-link" data-view="orders-tracking" onclick="app.navigate('orders-tracking')">
            <span class="icon">📦</span> <span data-i18n="orders">My Orders</span>
          </button>
          <button class="sidebar-nav-link" data-view="payment-status" onclick="app.navigate('payment-status')">
            <span class="icon">💳</span> <span data-i18n="payments">Payment Status</span>
          </button>
          <button class="sidebar-nav-link" data-view="fpo-dashboard" onclick="app.navigate('fpo-dashboard')">
            <span class="icon">🤝</span> <span data-i18n="fpoDashboard">FPO Dashboard</span>
          </button>
          <button class="sidebar-nav-link" data-view="ai-assistant" onclick="app.navigate('ai-assistant')">
            <span class="icon">🤖</span> <span data-i18n="aiAssistant">AI Assistant</span>
          </button>
          <button class="sidebar-nav-link" data-view="weather-alerts" onclick="app.navigate('weather-alerts')">
            <span class="icon">⛅</span> <span data-i18n="weatherAlerts">Weather Alerts</span>
          </button>
          <button class="sidebar-nav-link" data-view="disputes" onclick="app.navigate('disputes')">
            <span class="icon">⭐</span> <span data-i18n="disputes">Ratings & Disputes</span>
          </button>
          <button class="sidebar-nav-link" data-view="settings" onclick="app.navigate('settings')">
            <span class="icon">⚙️</span> <span data-i18n="settings">Settings & AI Key</span>
          </button>
        `;
      }
      I18N.updateDOM();
    },

    // AI Recommendation Card on Dashboard (Slides 5, 12, 17)
    renderRecommendationCard() {
      const cardEl = document.getElementById("ai-recommendation-card");
      if (!cardEl) return;

      const decision = this.coordinator.optimizationAgent.evaluateDecision({
        cropId: this.activeCropId,
        quantityKg: 500,
        waitDays: 3,
        urgentCashNeeded: false,
        hasStorage: false
      });

      cardEl.innerHTML = `
        <div class="card-badge-row">
          <span class="badge badge-primary">⭐ ${I18N.t("ourRecommendation")}</span>
          <span class="badge badge-success">Govt Agmarknet Verified</span>
        </div>
        <h3 class="rec-title">${decision.recommendation}</h3>
        <div class="rec-metrics">
          <div class="metric-item">
            <span class="label">${I18N.t("expectedNetProfit")}</span>
            <span class="value">₹${decision.todayScenario.netReturn.toLocaleString('en-IN')}</span>
            <span class="sub-label">(${I18N.t("afterTransportCost")})</span>
          </div>
          <div class="metric-item">
            <span class="label">${I18N.t("tomatoPrice")}</span>
            <span class="value">₹${decision.todayScenario.pricePerKg.toFixed(2)}/kg</span>
            <span class="sub-label trend-up">▲ +3.2% today</span>
          </div>
        </div>
        <div class="rec-points">
          <div class="point-item"><span class="check">✓</span> <span>Current mandi price is at 6-month high band (Agmarknet DMI)</span></div>
          <div class="point-item"><span class="check">✓</span> <span>Waiting 3 days ambient adds ₹2,250 storage & 20-30% NHB decay loss</span></div>
          <div class="point-item"><span class="check">✓</span> <span>Transport cost is optimal (12 km, ₹900)</span></div>
        </div>
        <div class="rec-actions">
          <button class="btn btn-primary" onclick="app.navigate('sell-vs-wait')">${I18N.t("viewDetails")}</button>
          <button class="btn btn-outline" onclick="app.openVoiceModal()">🎙️ Ask Voice Assistant</button>
        </div>
      `;
    },

    // Market Comparison Table (Slide 6, 13, 19)
    renderMandiComparison() {
      const container = document.getElementById("mandi-comparison-tbody");
      if (!container) return;

      const comp = this.coordinator.marketAgent.getMandiComparison(this.activeCropId, 500);
      container.innerHTML = comp.rankings.map((r, idx) => `
        <tr class="${idx === 0 ? 'highlight-best-row' : ''}">
          <td>
            <strong>${r.mandiName}</strong>
            ${idx === 0 ? '<span class="badge badge-best-mini">Best Return</span>' : ''}
            <div class="sub-meta">${r.location} • <span class="text-muted">${r.updatedAt}</span></div>
          </td>
          <td>
            <span class="price-cell">₹${r.pricePerKg.toFixed(2)}/kg</span>
            <span class="trend-badge ${r.trend === 'up' ? 'trend-up' : 'trend-down'}">${r.priceChange}</span>
          </td>
          <td>${r.distanceKm} km</td>
          <td>₹${r.transportCost.toLocaleString('en-IN')}</td>
          <td><strong class="net-return-cell">₹${r.netReturn.toLocaleString('en-IN')}</strong></td>
          <td>
            <button class="btn btn-sm btn-outline" onclick="app.selectMandi('${r.mandiId}')">Select</button>
          </td>
        </tr>
      `).join("");
    },

    // Interactive Price Trend Chart (SVG) (Slides 9, 14, 15)
    renderPriceChart() {
      const svg = document.getElementById("price-trend-svg");
      if (!svg) return;

      const trendData = this.coordinator.trendAgent.getTrendAnalysis(this.activeCropId);
      const points = trendData.historical;

      const width = 640;
      const height = 240;
      const padding = 40;

      const minP = 14;
      const maxP = 28;

      const getX = (idx) => padding + (idx * (width - 2 * padding) / (points.length - 1));
      const getY = (val) => height - padding - ((val - minP) / (maxP - minP) * (height - 2 * padding));

      const pathPoints = points.map((p, i) => `${getX(i)},${getY(p.price)}`).join(" ");
      const areaPoints = `${getX(0)},${height - padding} ${pathPoints} ${getX(points.length - 1)},${height - padding}`;

      let circlesHtml = points.map((p, i) => `
        <circle cx="${getX(i)}" cy="${getY(p.price)}" r="6" fill="#15803d" stroke="#ffffff" stroke-width="2.5" />
        <text x="${getX(i)}" y="${getY(p.price) - 12}" font-size="11" font-weight="600" fill="#1e293b" text-anchor="middle">₹${p.price.toFixed(1)}</text>
        <text x="${getX(i)}" y="${height - 15}" font-size="11" fill="#64748b" text-anchor="middle">${p.month}</text>
      `).join("");

      const lastX = getX(points.length - 1);
      const lastY = getY(points[points.length - 1].price);
      const forecastX = width - 15;
      const forecastY = getY(25.0);

      svg.innerHTML = `
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#22c55e" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#22c55e" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <line x1="${padding}" y1="${getY(16)}" x2="${width - padding}" y2="${getY(16)}" stroke="#e2e8f0" stroke-dasharray="4"/>
        <line x1="${padding}" y1="${getY(20)}" x2="${width - padding}" y2="${getY(20)}" stroke="#e2e8f0" stroke-dasharray="4"/>
        <line x1="${padding}" y1="${getY(24)}" x2="${width - padding}" y2="${getY(24)}" stroke="#e2e8f0" stroke-dasharray="4"/>
        <polygon points="${areaPoints}" fill="url(#priceGradient)"/>
        <polyline points="${pathPoints}" fill="none" stroke="#15803d" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="${lastX}" y1="${lastY}" x2="${forecastX}" y2="${forecastY}" stroke="#eab308" stroke-width="3" stroke-dasharray="5 4"/>
        <circle cx="${forecastX}" cy="${forecastY}" r="5" fill="#eab308" />
        <text x="${forecastX}" y="${forecastY - 10}" font-size="10" font-weight="bold" fill="#b45309" text-anchor="end">Agmarknet Model: ₹24-26</text>
        ${circlesHtml}
      `;

      const statAvg = document.getElementById("stat-avg-price");
      const statHigh = document.getElementById("stat-high-price");
      const statLow = document.getElementById("stat-low-price");
      const statMove = document.getElementById("stat-movement");

      if (statAvg) statAvg.innerText = `₹${trendData.sixMonthAverage}/kg`;
      if (statHigh) statHigh.innerText = `₹${trendData.highestPrice}/kg`;
      if (statLow) statLow.innerText = `₹${trendData.lowestPrice}/kg`;
      if (statMove) statMove.innerText = trendData.priceMovement;
    },

    // Sell vs Wait Calculator Engine (Slides 4, 17, 18)
    updateSellVsWaitCalculation() {
      const qtyInput = document.getElementById("calc-quantity-input");
      const daysInput = document.getElementById("calc-days-input");
      const urgentCheck = document.getElementById("calc-urgent-cash-check");
      const storageCheck = document.getElementById("calc-has-storage-check");

      const quantityKg = qtyInput ? parseFloat(qtyInput.value) || 500 : 500;
      const waitDays = daysInput ? parseInt(daysInput.value) || 3 : 3;
      const urgentCash = urgentCheck ? urgentCheck.checked : false;
      const hasStorage = storageCheck ? storageCheck.checked : false;

      const result = this.coordinator.optimizationAgent.evaluateDecision({
        cropId: this.activeCropId,
        quantityKg: quantityKg,
        waitDays: waitDays,
        urgentCashNeeded: urgentCash,
        hasStorage: hasStorage
      });

      const todayNetEl = document.getElementById("calc-today-net");
      const todayGrossEl = document.getElementById("calc-today-gross");
      const todayTransEl = document.getElementById("calc-today-transport");

      const waitNetEl = document.getElementById("calc-wait-net");
      const waitGrossEl = document.getElementById("calc-wait-gross");
      const waitStorageEl = document.getElementById("calc-wait-storage");
      const waitSpoilageEl = document.getElementById("calc-wait-spoilage");

      const recTitleEl = document.getElementById("calc-rec-title");
      const recReasonEl = document.getElementById("calc-rec-reason");
      const diffBadgeEl = document.getElementById("calc-diff-badge");

      if (todayNetEl) todayNetEl.innerText = `₹${result.todayScenario.netReturn.toLocaleString('en-IN')}`;
      if (todayGrossEl) todayGrossEl.innerText = `₹${result.todayScenario.grossValue.toLocaleString('en-IN')}`;
      if (todayTransEl) todayTransEl.innerText = `-₹${result.todayScenario.transportCost.toLocaleString('en-IN')}`;

      if (waitNetEl) waitNetEl.innerText = `₹${result.waitScenario.netReturn.toLocaleString('en-IN')}`;
      if (waitGrossEl) waitGrossEl.innerText = `₹${result.waitScenario.futureGrossValue.toLocaleString('en-IN')}`;
      if (waitStorageEl) waitStorageEl.innerText = `-₹${result.waitScenario.storageCost.toLocaleString('en-IN')}`;
      if (waitSpoilageEl) waitSpoilageEl.innerText = `${result.waitScenario.spoilagePercentage} (${result.waitScenario.lostQuantityKg} kg lost)`;

      if (recTitleEl) recTitleEl.innerText = result.recommendation;
      if (recReasonEl) {
        let text = result.reason;
        if (result.mspWarning) {
          text += ` <br><strong style="color:#d97706;">⚠️ CACP Notice:</strong> ${result.mspWarning}`;
        }
        recReasonEl.innerHTML = text;
      }

      if (diffBadgeEl) {
        if (result.difference < 0) {
          diffBadgeEl.className = "badge badge-success";
          diffBadgeEl.innerText = `Sell Today gives ₹${Math.abs(result.difference).toLocaleString('en-IN')} more`;
        } else {
          diffBadgeEl.className = "badge badge-warning";
          diffBadgeEl.innerText = `Wait gains ₹${result.difference.toLocaleString('en-IN')} (subject to risk)`;
        }
      }
    },

    // My Crops View (Slides 8, 16)
    renderMyCrops() {
      const container = document.getElementById("my-crops-list");
      if (!container) return;

      container.innerHTML = this.data.farmerCrops.map(crop => `
        <div class="crop-card">
          <div class="crop-card-header">
            <div class="crop-icon-title">
              <span class="crop-emoji">${crop.cropId === 'tomato' ? '🍅' : (crop.cropId === 'paddy' ? '🌾' : '🌱')}</span>
              <div>
                <h4>${crop.cropName}</h4>
                <p class="crop-sub">${crop.variety} • ${crop.fieldArea}</p>
              </div>
            </div>
            <span class="badge ${crop.stage === 'Ready' ? 'badge-success' : 'badge-primary'}">${crop.stage}</span>
          </div>

          <div class="crop-metrics-grid">
            <div class="metric-box">
              <span class="label">Quantity</span>
              <span class="val">${crop.quantityKg} kg</span>
            </div>
            <div class="metric-box">
              <span class="label">Harvest Date</span>
              <span class="val">${crop.harvestDate}</span>
            </div>
            <div class="metric-box">
              <span class="label">Readiness</span>
              <span class="val">${crop.daysToHarvest === 0 ? 'Harvest Today' : `In ${crop.daysToHarvest} days`}</span>
            </div>
            <div class="metric-box">
              <span class="label">Quality</span>
              <span class="val">${crop.qualityGrade}</span>
            </div>
          </div>

          <div class="harvest-progress-stepper">
            <div class="step-point done">
              <span class="dot">✓</span>
              <span class="step-lbl">Growing</span>
            </div>
            <div class="step-line ${crop.stage === 'Ready' || crop.stage === 'Harvested' ? 'active' : ''}"></div>
            <div class="step-point ${crop.stage === 'Ready' || crop.stage === 'Harvested' ? 'done' : 'active'}">
              <span class="dot">${crop.stage === 'Ready' ? '●' : '✓'}</span>
              <span class="step-lbl">Ready</span>
            </div>
            <div class="step-line ${crop.stage === 'Harvested' ? 'active' : ''}"></div>
            <div class="step-point ${crop.stage === 'Harvested' ? 'done' : ''}">
              <span class="dot">○</span>
              <span class="step-lbl">Harvested</span>
            </div>
          </div>

          <div class="crop-card-actions">
            <button class="btn btn-sm btn-primary" onclick="app.openListProduceModal('${crop.cropId}', ${crop.quantityKg})">
              📤 List on Marketplace
            </button>
            <button class="btn btn-sm btn-outline" onclick="app.runSellWaitForCrop('${crop.cropId}', ${crop.quantityKg})">
              ⚖️ Check Best Mandi
            </button>
          </div>
        </div>
      `).join("");
    },

    // Marketplace Listings View (Slides 24, 25, 26, 28)
    renderMarketplaceListings() {
      const container = document.getElementById("marketplace-listings-container");
      if (!container) return;

      container.innerHTML = this.data.marketplaceListings.map(listing => `
        <div class="listing-card">
          <div class="listing-header">
            <div>
              <h3>${listing.cropName} (${listing.quantityKg.toLocaleString('en-IN')} kg)</h3>
              <p class="sub-meta">Farmer: ${listing.farmerName} • ${listing.farmerVillage} • Listed: ${listing.createdAt}</p>
            </div>
            <div class="listing-status-group">
              <span class="badge ${listing.status === 'Sold' ? 'badge-success' : 'badge-primary'}">${listing.status}</span>
              <span class="asking-pill">Asking: ₹${listing.askingPrice.toFixed(2)}/kg</span>
            </div>
          </div>

          <div class="offers-section">
            <div class="offers-header">
              <h4>Received Buyer Offers (${listing.offers.length})</h4>
              <span class="sub-label">Compare net return after transport and choose to negotiate or accept</span>
            </div>

            ${listing.offers.length === 0 ? '<p class="text-muted">No offers submitted yet. Matching buyers notified.</p>' : `
              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Buyer</th>
                      <th>Offer Price</th>
                      <th>Requested Qty</th>
                      <th>Transport Mode</th>
                      <th>Est. Net Return</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${listing.offers.map(off => `
                      <tr class="${off.status === 'Accepted' ? 'highlight-accepted' : ''}">
                        <td>
                          <strong>${off.buyerName}</strong>
                          ${off.isVerified ? '<span class="verified-tag">✓ Verified</span>' : '<span class="badge badge-warning">Unverified</span>'}
                          <div class="sub-meta">Rating: ★ ${off.buyerRating} • Distance: ${off.distanceKm} km</div>
                        </td>
                        <td><strong class="price-cell">₹${off.offerPrice.toFixed(2)}/kg</strong></td>
                        <td>${off.requestedQty} kg</td>
                        <td>
                          <span class="transport-tag">${off.transportMode}</span>
                          <div class="sub-meta">Cost to farmer: ₹${off.transportCostToFarmer}</div>
                        </td>
                        <td><strong class="net-return-cell">₹${off.netReturn.toLocaleString('en-IN')}</strong></td>
                        <td>
                          ${off.status === 'Accepted' ? '<span class="badge badge-success">Deal Closed</span>' : `
                            <div class="action-btn-row">
                              <button class="btn btn-sm btn-primary" onclick="app.acceptOffer('${listing.id}', '${off.id}')">Accept</button>
                              <button class="btn btn-sm btn-outline" onclick="app.openNegotiateModal('${listing.id}', '${off.id}', ${off.offerPrice})">Negotiate</button>
                            </div>
                          `}
                        </td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>
      `).join("");
    },

    // Orders & Tracking View (Slides 29, 30)
    renderOrders() {
      const container = document.getElementById("orders-list-container");
      if (!container) return;

      container.innerHTML = this.data.orders.map(order => `
        <div class="order-card">
          <div class="order-header">
            <div>
              <span class="order-badge">${order.orderId}</span>
              <h3>${order.cropName}</h3>
              <p class="sub-meta">Buyer: <strong>${order.buyerName}</strong> • Date: ${order.orderDate}</p>
            </div>
            <div class="order-val-badge">
              <span class="label">Total Value</span>
              <span class="val">₹${order.totalValue.toLocaleString('en-IN')}</span>
              <span class="badge ${order.orderStatus === 'Delivered' ? 'badge-success' : 'badge-warning'}">${order.orderStatus}</span>
            </div>
          </div>

          <div class="order-stepper">
            ${order.milestones.map((m, idx) => `
              <div class="milestone-node ${m.completed ? 'completed' : 'pending'}">
                <div class="node-icon">${m.completed ? '✓' : idx + 1}</div>
                <div class="node-info">
                  <span class="node-title">${m.title}</span>
                  <span class="node-date">${m.date}</span>
                </div>
              </div>
            `).join("")}
          </div>

          <div class="payment-card-sub">
            <div class="payment-metrics">
              <div class="p-item">
                <span class="lbl">Advance Paid</span>
                <span class="val text-success">₹${order.paymentStatus.advancePaid.toLocaleString('en-IN')} (Received)</span>
              </div>
              <div class="p-item">
                <span class="lbl">Balance on Delivery</span>
                <span class="val text-warning">₹${order.paymentStatus.deliveryPending.toLocaleString('en-IN')} (Escrow)</span>
              </div>
              <div class="p-item">
                <span class="lbl">Payment Mode</span>
                <span class="val">${order.paymentStatus.paymentMethod}</span>
              </div>
            </div>
            <div class="p-actions">
              <button class="btn btn-sm btn-outline" onclick="app.downloadReceipt('${order.orderId}')">📄 View & Print Receipt</button>
              ${order.orderStatus !== 'Delivered' ? `
                <button class="btn btn-sm btn-primary" onclick="app.advanceMilestone('${order.orderId}')">
                  🚀 Update Transit Step
                </button>
              ` : '<span class="badge badge-success">Completed & Settled</span>'}
            </div>
          </div>
        </div>
      `).join("");
    },

    // FPO Dashboard View (Slides 20, 35)
    renderFPODashboard() {
      const summary = this.fpoEngine.getAggregationSummary();

      const fpoNameEl = document.getElementById("fpo-hero-name");
      const fpoMembersEl = document.getElementById("fpo-metric-members");
      const fpoQtyEl = document.getElementById("fpo-metric-qty");
      const fpoSavingsEl = document.getElementById("fpo-metric-savings");
      const fpoLogisticsEl = document.getElementById("fpo-metric-logistics");
      const lotsTbody = document.getElementById("fpo-lots-tbody");

      if (fpoNameEl) fpoNameEl.innerText = `${summary.fpoName} (${summary.registrationNumber})`;
      if (fpoMembersEl) fpoMembersEl.innerText = summary.totalMembers;
      if (fpoQtyEl) fpoQtyEl.innerText = `${summary.combinedQuantityKg.toLocaleString('en-IN')} kg`;
      if (fpoSavingsEl) fpoSavingsEl.innerText = `₹${summary.logistics.savings.toLocaleString('en-IN')} (${summary.logistics.savingsPercent}%)`;
      if (fpoLogisticsEl) fpoLogisticsEl.innerText = `₹${summary.logistics.pooledCost.toLocaleString('en-IN')}`;

      if (lotsTbody) {
        lotsTbody.innerHTML = summary.lots.map(lot => `
          <tr>
            <td><strong>${lot.memberName}</strong></td>
            <td>${lot.village}</td>
            <td><span class="crop-tag">${lot.crop}</span></td>
            <td>${lot.quantityKg} kg</td>
            <td><span class="badge badge-outline">${lot.grade}</span></td>
          </tr>
        `).join("");
      }
    },

    // =========================================================================
    // GOVERNMENT AGRI DATA HUB (Agmarknet, CACP MSP, NHB, e-NAM, Portals)
    // =========================================================================
    setGovtTab(tabName) {
      this.activeGovtTab = tabName;
      document.querySelectorAll(".govt-tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === tabName);
      });
      document.querySelectorAll(".govt-tab-content").forEach(content => {
        content.classList.remove("active");
      });
      const target = document.getElementById(`govt-tab-${tabName}`);
      if (target) target.classList.add("active");
    },

    renderGovtDataHub() {
      this.renderAgmarknetMandiTable();
      this.renderMspTable();
      this.renderNhbGuidelines();
    },

    async renderAgmarknetMandiTable() {
      const tbody = document.getElementById("agmarknet-mandi-tbody");
      if (!tbody) return;

      const stateFilter = document.getElementById("agmarknet-state-filter")?.value || "";
      const cropFilter = document.getElementById("agmarknet-commodity-filter")?.value || "";

      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px;">Fetching Agmarknet records...</td></tr>`;

      const result = await this.govtDataService.fetchAgmarknetRecords({
        state: stateFilter,
        commodity: cropFilter
      });

      const badgeSource = document.getElementById("agmarknet-source-badge");
      if (badgeSource) {
        badgeSource.innerText = result.isLive ? "🟢 Live data.gov.in Feed" : "🏛️ Agmarknet DMI Verified Govt Dataset";
      }

      if (result.records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#64748b;">No mandi records found for selected filters.</td></tr>`;
        return;
      }

      tbody.innerHTML = result.records.map(r => `
        <tr>
          <td><strong>${r.market}</strong><div class="sub-meta">${r.district}, ${r.state}</div></td>
          <td><span class="crop-tag">${r.commodity}</span><div class="sub-meta">${r.variety}</div></td>
          <td>${r.arrivalDate}</td>
          <td>₹${r.minPrice.toLocaleString('en-IN')}</td>
          <td>₹${r.maxPrice.toLocaleString('en-IN')}</td>
          <td><strong class="price-cell">₹${r.modalPrice.toLocaleString('en-IN')}/Qtl</strong><div class="sub-meta">(₹${r.pricePerKg}/kg)</div></td>
          <td>${r.arrivalsTonnes} Tonnes</td>
        </tr>
      `).join("");
    },

    renderMspTable() {
      const tbody = document.getElementById("msp-data-tbody");
      if (!tbody) return;

      const mspList = this.govtDataService.getMspList();
      tbody.innerHTML = mspList.map(m => `
        <tr>
          <td><strong>${m.commodity}</strong><div class="sub-meta">${m.category}</div></td>
          <td>₹${m.msp2023.toLocaleString('en-IN')}</td>
          <td>₹${m.msp2024.toLocaleString('en-IN')}</td>
          <td><strong class="net-return-cell" style="font-size:15px;">₹${m.msp2025.toLocaleString('en-IN')}</strong><div class="sub-meta">(₹${m.pricePerKg}/kg)</div></td>
          <td>₹${m.costOfProductionA2FL.toLocaleString('en-IN')}</td>
          <td><span class="badge badge-success">+${m.marginPercent}%</span></td>
          <td><span style="font-size:12px;">${m.procuringAgency}</span></td>
        </tr>
      `).join("");
    },

    renderNhbGuidelines() {
      const container = document.getElementById("nhb-cards-grid");
      if (!container) return;

      const stds = window.GOVT_AGRI_DATA.nhbStorageStandards;
      container.innerHTML = Object.keys(stds).map(k => {
        const s = stds[k];
        return `
          <div class="app-card" style="border-left: 4px solid var(--primary);">
            <div class="card-title-row">
              <h4>${s.commodity}</h4>
              <span class="badge ${s.perishabilityRank.includes('High') ? 'badge-danger' : (s.perishabilityRank.includes('Moderate') ? 'badge-warning' : 'badge-success')}">
                ${s.perishabilityRank}
              </span>
            </div>
            <div style="font-size: 13px; display:flex; flex-direction:column; gap:6px; color:#334155;">
              <div><strong>Optimal Temperature:</strong> ${s.optimalTemperature}</div>
              <div><strong>Relative Humidity:</strong> ${s.relativeHumidity}</div>
              <div><strong>Ambient Shelf Life:</strong> ${s.ambientShelfLife}</div>
              <div><strong>Cold Storage Life:</strong> ${s.coldStorageLife}</div>
              <div style="background:#f1f5f9; padding:8px; border-radius:6px; font-size:11.5px; margin-top:4px;">
                <strong>⚠️ NHB Advisory:</strong> ${s.chillingInjuryThreshold}
              </div>
            </div>
          </div>
        `;
      }).join("");
    },

    // AI Conversational Chat Assistant with Actual Gemini / Neural Engine
    async sendChatMessage(customText) {
      const input = document.getElementById("chat-user-input");
      const text = customText || (input ? input.value : "");
      if (!text || text.trim() === "") return;

      const chatContainer = document.getElementById("chat-conversation-container");
      if (!chatContainer) return;

      // Append user bubble
      chatContainer.innerHTML += `
        <div class="chat-bubble user-bubble">
          <div class="chat-sender">You</div>
          <div class="chat-content">${text}</div>
        </div>
      `;

      if (input) input.value = "";

      // Add thinking bubble with animated dots
      const thinkingId = "thinking-" + Date.now();
      chatContainer.innerHTML += `
        <div id="${thinkingId}" class="chat-bubble ai-bubble" style="opacity:0.8;">
          <div class="chat-sender">🤖 KRISHI-NIRNAY AI</div>
          <div class="chat-content">
            <span class="pulse-dot active"></span> Analyzing query with Government Agmarknet & Gemini AI...
          </div>
        </div>
      `;
      chatContainer.scrollTop = chatContainer.scrollHeight;

      // Call assistant agent asynchronously with live Gemini / Neural Reasoner
      try {
        const response = await this.coordinator.assistantAgent.respondToQueryAsync(text, I18N.currentLang);
        
        let reply = response.replyEn;
        if (I18N.currentLang === "hi" && response.replyHi) reply = response.replyHi;
        else if (I18N.currentLang === "kn" && response.replyKn) reply = response.replyKn;

        const thinkBubble = document.getElementById(thinkingId);
        if (thinkBubble) thinkBubble.remove();

        let cardHtml = "";
        if (response.actionCard) {
          cardHtml = `
            <div class="chat-action-card">
              <span class="badge badge-success">${response.actionCard.title}</span>
              <h4>${response.actionCard.mandi}</h4>
              <div class="val">${response.actionCard.netProfit}</div>
              <p class="sub">${response.actionCard.gainPercent}</p>
            </div>
          `;
        }

        const sourceLabel = response.source || (this.krishiAiEngine.hasApiKey() ? "Google Gemini Live AI" : "KRISHI Specialist Multi-Agent Engine");
        
        chatContainer.innerHTML += `
          <div class="chat-bubble ai-bubble">
            <div class="chat-sender" style="display:flex; justify-content:space-between; align-items:center;">
              <span>🤖 KRISHI-NIRNAY AI</span>
              <span class="badge badge-primary" style="font-size:10px;">${sourceLabel}</span>
            </div>
            <div class="chat-content" style="white-space: pre-line;">${reply}</div>
            ${cardHtml}
            <div class="chat-speak-btn" style="margin-top:10px;">
              <button class="btn btn-sm btn-icon" onclick="app.voiceEngine.speak('${reply.replace(/'/g, "\\'").replace(/\n/g, " ")}')">🔊 Listen spoken answer</button>
            </div>
          </div>
        `;
        chatContainer.scrollTop = chatContainer.scrollHeight;
      } catch (err) {
        console.error(err);
        const thinkBubble = document.getElementById(thinkingId);
        if (thinkBubble) thinkBubble.remove();
      }
    },

    // Gemini AI API Configuration Dialog
    openGeminiConfigModal() {
      const modal = document.getElementById("gemini-config-modal");
      if (modal) {
        modal.classList.remove("hidden");
        const keyInput = document.getElementById("gemini-api-key-input");
        const modelSelect = document.getElementById("gemini-model-select");
        if (keyInput) keyInput.value = this.krishiAiEngine.getApiKey();
        if (modelSelect) modelSelect.value = this.krishiAiEngine.selectedModel;
      }
    },

    closeGeminiConfigModal() {
      const modal = document.getElementById("gemini-config-modal");
      if (modal) modal.classList.add("hidden");
    },

    saveGeminiConfig(event) {
      event.preventDefault();
      const keyInput = document.getElementById("gemini-api-key-input");
      const modelSelect = document.getElementById("gemini-model-select");
      if (keyInput) this.krishiAiEngine.setApiKey(keyInput.value);
      if (modelSelect) this.krishiAiEngine.setModel(modelSelect.value);

      this.closeGeminiConfigModal();
      alert("AI Configuration saved! Your assistant is now powered by Google Gemini AI.");
      this.updateAiStatusBadge();
    },

    updateAiStatusBadge() {
      const badge = document.getElementById("ai-status-indicator-badge");
      if (badge) {
        if (this.krishiAiEngine.hasApiKey()) {
          badge.className = "badge badge-success";
          badge.innerHTML = `🟢 Live Gemini AI (${this.krishiAiEngine.selectedModel})`;
        } else {
          badge.className = "badge badge-outline";
          badge.innerHTML = `⚡ Intelligent Agricultural Neural Engine (Zero-Key)`;
        }
      }
    },

    // Voice Modal Handling
    openVoiceModal() {
      const modal = document.getElementById("voice-assistant-modal");
      if (modal) {
        modal.classList.remove("hidden");
        const canvas = document.getElementById("voice-visualizer-canvas");
        if (canvas) {
          this.voiceEngine.attachCanvas(canvas);
        }
        this.voiceEngine.startListening();
      }
    },

    closeVoiceModal() {
      const modal = document.getElementById("voice-assistant-modal");
      if (modal) {
        modal.classList.add("hidden");
        this.voiceEngine.stopListening();
      }
    },

    openAddCropModal() {
      const modal = document.getElementById("add-crop-modal");
      if (modal) modal.classList.remove("hidden");
    },

    closeAddCropModal() {
      const modal = document.getElementById("add-crop-modal");
      if (modal) modal.classList.add("hidden");
    },

    submitAddCrop(event) {
      event.preventDefault();
      const form = event.target;
      const cropName = form.cropName.value;
      const variety = form.variety.value;
      const quantityKg = parseFloat(form.quantityKg.value);
      const harvestDate = form.harvestDate.value;
      const stage = form.stage.value;

      this.data.farmerCrops.push({
        id: "crop-" + Date.now(),
        cropId: cropName.toLowerCase().includes("tomato") ? "tomato" : "paddy",
        cropName: cropName,
        variety: variety,
        quantityKg: quantityKg,
        fieldArea: "1.0 Acre",
        harvestDate: harvestDate,
        stage: stage,
        daysToHarvest: 5,
        qualityGrade: "Grade A",
        storageAvailable: false,
        urgentCashNeeded: false
      });

      this.closeAddCropModal();
      this.renderMyCrops();
      alert("Crop added successfully to your harvest schedule!");
    },

    openListProduceModal(cropId, defaultQty = 1000) {
      const modal = document.getElementById("list-produce-modal");
      if (!modal) return;
      modal.classList.remove("hidden");
      const cropInput = document.getElementById("list-crop-name");
      const qtyInput = document.getElementById("list-crop-qty");
      if (cropInput) cropInput.value = cropId ? cropId.toUpperCase() : "Tomato";
      if (qtyInput) qtyInput.value = defaultQty;
    },

    closeListProduceModal() {
      const modal = document.getElementById("list-produce-modal");
      if (modal) modal.classList.add("hidden");
    },

    submitListProduce(event) {
      event.preventDefault();
      const form = event.target;
      this.marketplace.createListing({
        cropId: this.activeCropId,
        cropName: form.cropName.value,
        quantityKg: form.quantityKg.value,
        askingPrice: form.askingPrice.value,
        grade: form.grade.value,
        location: form.location.value
      });

      this.closeListProduceModal();
      this.navigate("buyer-marketplace");
      alert("Produce successfully published to Buyer Marketplace!");
    },

    acceptOffer(listingId, offerId) {
      const order = this.marketplace.acceptOffer(listingId, offerId);
      if (order) {
        this.renderMarketplaceListings();
        alert(`Offer accepted! Order ${order.orderId} created. Advance payment of ₹${order.paymentStatus.advancePaid.toLocaleString('en-IN')} marked received.`);
        this.navigate("orders-tracking");
      }
    },

    openNegotiateModal(listingId, offerId, currentPrice) {
      const newPrice = prompt(`Current Buyer Offer is ₹${currentPrice}/kg.\nEnter your counter-offer price (₹/kg):`, (currentPrice + 1.0).toFixed(2));
      if (newPrice && !isNaN(newPrice)) {
        this.marketplace.counterOffer(listingId, offerId, newPrice);
        this.renderMarketplaceListings();
        alert(`Counter-offer of ₹${newPrice}/kg submitted to buyer!`);
      }
    },

    advanceMilestone(orderId) {
      const order = this.marketplace.advanceOrderMilestone(orderId);
      if (order) {
        this.renderOrders();
        alert(`Order ${orderId} updated to: ${order.orderStatus}`);
      }
    },

    downloadReceipt(orderId) {
      const order = this.data.orders.find(o => o.orderId === orderId);
      if (!order) return;
      alert(`=== KRISHI-NIRNAY AI APMC TRANSACTION RECEIPT ===\nReceipt #: ${order.paymentStatus.receiptId}\nOrder #: ${order.orderId}\nCrop: ${order.cropName}\nTotal Value: ₹${order.totalValue}\nAdvance Received: ₹${order.paymentStatus.advancePaid}\nStatus: ${order.paymentStatus.status}\nVerified Escrow via Karnataka APMC Gateway`);
    },

    openDisputeModal() {
      const issueType = prompt("Select Issue Type:\n1. Payment delay\n2. Quantity mismatch\n3. Quality disagreement\nEnter 1, 2, or 3:", "1");
      const types = { "1": "Payment delay", "2": "Quantity mismatch", "3": "Quality disagreement" };
      const selectedType = types[issueType] || "Payment delay";
      const evidence = prompt("Enter brief details / evidence (e.g. Weighbridge slip # or Bank UTR):", "APMC weighment slip #4401 mismatched by 40 kg");

      if (evidence) {
        this.marketplace.raiseDispute({
          orderId: "KN-1042",
          buyerName: "ABC Foods",
          issueType: selectedType,
          evidence: evidence
        });
        alert("Dispute registered! Case submitted to APMC conciliation desk.");
        this.navigate("disputes");
      }
    },

    selectMandi(mandiId) {
      this.navigate("sell-vs-wait");
      const mandiSelect = document.getElementById("calc-mandi-select");
      if (mandiSelect) {
        mandiSelect.value = mandiId;
        this.updateSellVsWaitCalculation();
      }
    },

    runSellWaitForCrop(cropId, qty) {
      this.activeCropId = cropId;
      this.navigate("sell-vs-wait");
      const qtyInput = document.getElementById("calc-quantity-input");
      if (qtyInput) qtyInput.value = qty;
      this.updateSellVsWaitCalculation();
    }
  };

  // Initial Boot
  app.renderSidebarMenu();
  app.renderRecommendationCard();
  app.renderMandiComparison();
  app.renderPriceChart();
  app.updateSellVsWaitCalculation();
  app.renderMyCrops();
  app.renderMarketplaceListings();
  app.renderOrders();
  app.renderFPODashboard();
  app.updateAiStatusBadge();

  // Populate crop selector tabs
  document.querySelectorAll(".crop-pill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".crop-pill-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      app.activeCropId = btn.dataset.crop;
      app.renderRecommendationCard();
      app.renderMandiComparison();
      app.renderPriceChart();
      app.updateSellVsWaitCalculation();
    });
  });

  // Global search enter
  const searchInput = document.getElementById("global-search-input");
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const val = searchInput.value.toLowerCase();
        if (val.includes("tomato") || val.includes("tamatar")) {
          app.activeCropId = "tomato";
          app.navigate("market-prices");
        } else if (val.includes("govt") || val.includes("msp") || val.includes("agmarknet")) {
          app.navigate("govt-data-hub");
        } else if (val.includes("wait") || val.includes("sell")) {
          app.navigate("sell-vs-wait");
        } else if (val.includes("buyer")) {
          app.navigate("buyer-marketplace");
        } else {
          app.navigate("ai-assistant");
          app.sendChatMessage(searchInput.value);
        }
      }
    });
  }
});
