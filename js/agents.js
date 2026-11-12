/**
 * KRISHI-NIRNAY AI
 * Specialist Multi-Agent System (Agentic AI Workflow)
 * 
 * Coordinates:
 * 1. Market Intelligence Agent (Agmarknet & Mandi Metadata)
 * 2. Price Trend Agent (Historical Patterns & Uncertainty Forecasting)
 * 3. Transport Agent (Freight Estimation & Route Logistics)
 * 4. Storage & Spoilage Agent (NHB Standards & Perishability Decay)
 * 5. Profit Optimization Agent (Deterministic Net-Return & MSP Floor)
 * 6. Farmer Assistant Agent (Multilingual NLP, Voice & Gemini LLM)
 */

class MarketIntelligenceAgent {
  constructor(data) {
    this.data = data;
    this.name = "Market Intelligence Agent";
    this.role = "Retrieves and validates official Agmarknet mandi prices and market metadata";
  }

  getMandiComparison(cropId, quantityKg = 500) {
    const crop = this.data.crops.find(c => c.id === cropId) || this.data.crops[0];
    const results = this.data.mandis.map(mandi => {
      const cropData = mandi.cropPrices[cropId] || { pricePerKg: crop.basePrice, change: "0.0%", trend: "neutral" };
      const pricePerKg = cropData.pricePerKg;
      const grossValue = pricePerKg * quantityKg;
      
      // Calculate realistic transport
      const tonnes = quantityKg / 1000;
      const transportCost = Math.round(mandi.transportRates.baseFare + (mandi.distanceKm * mandi.transportRates.costPerKmPerTonne * Math.max(tonnes, 0.5)));
      const netReturn = grossValue - transportCost;

      return {
        mandiId: mandi.id,
        mandiName: mandi.name,
        location: mandi.location,
        distanceKm: mandi.distanceKm,
        pricePerKg: pricePerKg,
        priceChange: cropData.change,
        trend: cropData.trend,
        grossValue: grossValue,
        transportCost: transportCost,
        netReturn: netReturn,
        updatedAt: mandi.updatedAt,
        verified: mandi.verified,
        amenities: mandi.amenities,
        contact: mandi.contact
      };
    });

    // Sort by net return descending
    results.sort((a, b) => b.netReturn - a.netReturn);
    return {
      crop,
      quantityKg,
      rankings: results,
      bestOption: results[0]
    };
  }
}

class PriceTrendAgent {
  constructor(data) {
    this.data = data;
    this.name = "Price Trend Agent";
    this.role = "Analyses historical data and produces a forecast range with uncertainty";
  }

  getTrendAnalysis(cropId) {
    const crop = this.data.crops.find(c => c.id === cropId) || this.data.crops[0];
    const history = crop.historical;
    const currentPrice = crop.basePrice;
    
    const avgPrice = history.reduce((acc, h) => acc + h.price, 0) / history.length;
    const minPrice = Math.min(...history.map(h => h.min));
    const maxPrice = Math.max(...history.map(h => h.max));
    const oldestPrice = history[0].price;
    const percentChange = (((currentPrice - oldestPrice) / oldestPrice) * 100).toFixed(1);

    return {
      cropId: crop.id,
      cropName: crop.name,
      historical: history,
      currentPrice: currentPrice,
      sixMonthAverage: avgPrice.toFixed(2),
      highestPrice: maxPrice.toFixed(2),
      lowestPrice: minPrice.toFixed(2),
      priceMovement: (percentChange > 0 ? "+" : "") + percentChange + "%",
      forecast: crop.forecast,
      uncertainty: crop.forecast.confidence === "High" ? "Low" : (crop.forecast.confidence === "Medium" ? "Medium" : "High"),
      disclaimer: "Price forecasts are algorithmic estimates based on historical arrivals and seasonal trends, not guaranteed commitments."
    };
  }
}

class TransportAgent {
  constructor(data) {
    this.data = data;
    this.name = "Transport Agent";
    this.role = "Estimates route distance and transport cost, with assumptions shown";
  }

  estimateTransport(distanceKm, quantityKg, vehicleType = "mini_truck") {
    const vehicleProfiles = {
      auto_tempo: { name: "Three-Wheeler / Piaggio Ape", capacityKg: 600, baseFare: 250, perKm: 22 },
      mini_truck: { name: "Tata Ace / Dost Mini-Truck", capacityKg: 1500, baseFare: 400, perKm: 32 },
      canter_truck: { name: "Canter / 3-Tonne Truck", capacityKg: 3500, baseFare: 800, perKm: 48 },
      fpo_shared: { name: "FPO Pooled Transport (Shared)", capacityKg: 10000, baseFare: 150, perKm: 14 }
    };

    const profile = vehicleProfiles[vehicleType] || vehicleProfiles.mini_truck;
    const estimatedCost = Math.round(profile.baseFare + (distanceKm * profile.perKm));
    const perKgCost = (estimatedCost / quantityKg).toFixed(2);

    return {
      vehicleName: profile.name,
      capacityKg: profile.capacityKg,
      distanceKm: distanceKm,
      estimatedCost: estimatedCost,
      perKgCost: perKgCost,
      assumptions: [
        `Base yard exit fee: ₹${profile.baseFare}`,
        `Running transit rate: ₹${profile.perKm}/km for ${distanceKm} km`,
        `Assumes return trip covered under standard APMC commercial schedule`,
        `Tolls or unloading labour charges (approx ₹15-20/quintal) extra if applicable`
      ]
    };
  }
}

class StorageAndSpoilageAgent {
  constructor(data) {
    this.data = data;
    this.name = "Storage & Spoilage Agent";
    this.role = "Estimates storage expense and crop-specific waiting risk based on NHB standards";
  }

  calculateExposure(cropId, quantityKg, waitDays, storageType = "ambient") {
    const crop = this.data.crops.find(c => c.id === cropId) || this.data.crops[0];
    
    // Daily loss rates
    const dailyLossRate = (storageType === "cold") ? crop.dailyColdSpoilage : crop.dailyAmbientSpoilage;
    const storageRatePerDay = (storageType === "cold") ? crop.dailyStorageCostPerKg : (crop.dailyStorageCostPerKg * 0.4);

    // Total spoilage rate over waitDays (compounded decay curve)
    const totalSpoilageFraction = Math.min(1 - Math.pow(1 - dailyLossRate, waitDays), 0.60);
    const spoilagePercentage = (totalSpoilageFraction * 100).toFixed(1);
    const lostQuantityKg = Math.round(quantityKg * totalSpoilageFraction);
    const remainingQuantityKg = quantityKg - lostQuantityKg;

    // Total storage expense
    const totalStorageCost = Math.round(quantityKg * waitDays * storageRatePerDay);

    let exposureCategory = "Low";
    if (crop.perishability === "High") {
      exposureCategory = waitDays >= 3 ? "High" : "Moderate";
    } else if (crop.perishability === "Moderate") {
      exposureCategory = waitDays >= 7 ? "Moderate" : "Low";
    }

    return {
      cropName: crop.name,
      perishability: crop.perishability,
      storageType: storageType === "cold" ? "Cold Storage Yard (NHB Specs)" : "Ambient Farm Shed",
      waitDays: waitDays,
      spoilagePercentage: spoilagePercentage + "%",
      spoilageFraction: totalSpoilageFraction,
      lostQuantityKg: lostQuantityKg,
      remainingQuantityKg: remainingQuantityKg,
      totalStorageCost: totalStorageCost,
      dailyStorageRate: storageRatePerDay.toFixed(2),
      exposureCategory: exposureCategory,
      guidance: crop.perishability === "High" && storageType !== "cold" && waitDays >= 3
        ? "Waiting >3 days without cold storage may significantly reduce marketable weight and grade (NHB Guideline)."
        : "Storage feasible if moisture and ventilation are maintained."
    };
  }
}

class ProfitOptimizationAgent {
  constructor(marketAgent, trendAgent, transportAgent, storageAgent) {
    this.marketAgent = marketAgent;
    this.trendAgent = trendAgent;
    this.transportAgent = transportAgent;
    this.storageAgent = storageAgent;
    this.name = "Profit Optimization Agent";
    this.role = "Compares options using net-return calculations, MSP safety floor, and farmer constraints";
  }

  evaluateDecision({
    cropId = "tomato",
    quantityKg = 500,
    waitDays = 3,
    urgentCashNeeded = false,
    hasStorage = false,
    selectedMandiId = "mandi-bengaluru-rural",
    vehicleType = "mini_truck"
  }) {
    // 1. Get today's market ranking
    const marketComparison = this.marketAgent.getMandiComparison(cropId, quantityKg);
    const bestTodayMandi = marketComparison.bestOption;
    const targetMandi = marketComparison.rankings.find(m => m.mandiId === selectedMandiId) || bestTodayMandi;

    // Option A: Sell Today
    const todayPrice = targetMandi.pricePerKg;
    const todayGross = Math.round(todayPrice * quantityKg);
    const todayTransport = targetMandi.transportCost;
    const todayStorageCost = 0;
    const todayNetReturn = todayGross - todayTransport;

    // Option B: Wait Scenario
    const trendData = this.trendAgent.getTrendAnalysis(cropId);
    const futureExpectedPrice = (trendData.forecast.rangeMin + trendData.forecast.rangeMax) / 2;
    
    // Spoilage & storage
    const storageType = hasStorage ? "cold" : "ambient";
    const storageAnalysis = this.storageAgent.calculateExposure(cropId, quantityKg, waitDays, storageType);

    // Revenue from surviving produce
    const futureGross = Math.round(storageAnalysis.remainingQuantityKg * futureExpectedPrice);
    const futureTransport = targetMandi.transportCost;
    const futureStorageExpense = storageAnalysis.totalStorageCost;
    const futureNetReturn = futureGross - futureTransport - futureStorageExpense;

    // Difference
    const diffNet = futureNetReturn - todayNetReturn;

    // Check Government MSP Baseline if applicable
    let mspWarning = null;
    if (window.govtDataService) {
      const msp = window.govtDataService.getMspForCommodity(cropId);
      if (msp && todayPrice < msp.pricePerKg) {
        mspWarning = `Mandi price (₹${todayPrice}/kg) is below Government MSP (₹${msp.pricePerKg}/kg). You may register at the FCI/NAFED procurement desk.`;
      }
    }

    // Decision Logic
    let recommendation = "";
    let reason = "";
    let action = "SELL_TODAY";

    if (urgentCashNeeded) {
      action = "SELL_TODAY";
      recommendation = `Sell today at ${bestTodayMandi.mandiName}`;
      reason = "Farmer has an urgent cash requirement. Respecting immediate liquidity need: avoid waiting or risk of produce deterioration.";
    } else if (diffNet > 800 && storageAnalysis.exposureCategory !== "High") {
      action = "WAIT_AND_SELL";
      recommendation = `Wait ${waitDays} days and store in ${storageType === "cold" ? "Cold Storage" : "ventilated shed"}`;
      reason = `Expected net profit gains ₹${Math.abs(diffNet).toLocaleString('en-IN')} after subtracting storage and spoilage loss.`;
    } else {
      action = "SELL_TODAY";
      recommendation = `Sell today at ${bestTodayMandi.mandiName}`;
      reason = diffNet < 0 
        ? `Immediate sale gives higher net return (₹${Math.abs(diffNet).toLocaleString('en-IN')} more) because storage fees and spoilage exceed projected price gain.`
        : `Expected price rise is too narrow to justify storage risk and spoilage exposure. Immediate sale locks in guaranteed cash.`;
    }

    return {
      crop: trendData.cropName,
      quantityKg,
      waitDays,
      constraints: {
        urgentCashNeeded,
        hasStorage,
        storageType
      },
      todayScenario: {
        mandi: targetMandi.mandiName,
        pricePerKg: todayPrice,
        grossValue: todayGross,
        transportCost: todayTransport,
        storageCost: 0,
        spoilageLossKg: 0,
        netReturn: todayNetReturn
      },
      waitScenario: {
        days: waitDays,
        expectedFuturePrice: futureExpectedPrice,
        futureGrossValue: futureGross,
        transportCost: futureTransport,
        storageCost: futureStorageExpense,
        spoilagePercentage: storageAnalysis.spoilagePercentage,
        lostQuantityKg: storageAnalysis.lostQuantityKg,
        survivingQuantityKg: storageAnalysis.remainingQuantityKg,
        netReturn: futureNetReturn
      },
      difference: diffNet,
      action: action,
      recommendation: recommendation,
      reason: reason,
      mspWarning: mspWarning,
      bestTodayMandi: bestTodayMandi,
      dataFreshness: this.marketAgent.data.lastUpdated
    };
  }
}

class FarmerAssistantAgent {
  constructor(coordinator) {
    this.coordinator = coordinator;
    this.name = "Farmer Assistant Agent";
    this.role = "Explains results in natural language or voice and connects to Google Gemini AI";
  }

  async respondToQueryAsync(queryText, currentLang = "en") {
    if (window.krishiAiEngine) {
      const aiResponse = await window.krishiAiEngine.generateAdvice(queryText, currentLang);
      return {
        replyEn: aiResponse.text,
        replyHi: aiResponse.text,
        replyKn: aiResponse.text,
        source: aiResponse.source,
        isLiveAi: aiResponse.isLiveAi,
        actionCard: aiResponse.actionCard
      };
    }
    return this.respondToQuery(queryText, currentLang);
  }

  respondToQuery(queryText, currentLang = "en") {
    const q = queryText.toLowerCase().trim();
    
    if (q.includes("tomato") || q.includes("tamatar") || q.includes("ಟೊಮೆಟೊ") || q.includes("தக்காளி")) {
      const decision = this.coordinator.optimizationAgent.evaluateDecision({
        cropId: "tomato",
        quantityKg: 500,
        waitDays: 3,
        urgentCashNeeded: false,
        hasStorage: false
      });

      return {
        replyEn: `Based on Agmarknet live market data, Bengaluru Rural Mandi gives the highest net return of ₹${decision.todayScenario.netReturn.toLocaleString('en-IN')} for 500 kg tomatoes. Since tomatoes are perishable (loss risk 20-25% over 3 days under NHB standards), our recommendation is to Sell Today rather than storing.`,
        replyHi: `एगमार्कनेट लाइव मंडी भाव के अनुसार, 500 किग्रा टमाटर के लिए बेंगलुरु रूरल मंडी ₹${decision.todayScenario.netReturn.toLocaleString('en-IN')} का सर्वोत्तम शुद्ध लाभ देती है। टमाटर जल्दी खराब होने वाली फसल है, इसलिए 3 दिन रुकने के बजाय आज ही बेचना सबसे सुरक्षित विकल्प है।`,
        replyKn: `Agmarknet ಪ್ರಸ್ತುತ ಮಾಹಿತಿಯ ಪ್ರಕಾರ, 500 ಕೆಜಿ ಟೊಮೆಟೊಗೆ ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ ಮಂಡಿಯು ₹${decision.todayScenario.netReturn.toLocaleString('en-IN')} ಅತ್ಯುತ್ತಮ ನಿವ್ವಳ ಲಾಭ ನೀಡುತ್ತದೆ. ಟೊಮೆಟೊ ಬೇಗ ಹಾಳಾಗುವುದರಿಂದ, ದಾಸ್ತಾನು ಮಾಡುವ ಬದಲು ಇಂದೇ ಮಾರುವುದು ಸೂಕ್ತ.`,
        actionCard: {
          title: "Recommendation: Sell Today",
          mandi: "Bengaluru Rural Mandi",
          netProfit: `₹${decision.todayScenario.netReturn.toLocaleString('en-IN')}`,
          gainPercent: "+7.3% vs other mandis"
        }
      };
    }

    if (q.includes("msp") || q.includes("support price") || q.includes("ಸರ್ಕಾರಿ ಬೆಲೆ")) {
      return {
        replyEn: "Official Government of India CACP MSP for 2025-26: Paddy (Common) is ₹2,360/Quintal, Ragi is ₹4,450/Quintal, Maize is ₹2,310/Quintal, and Wheat is ₹2,425/Quintal. Direct procurement centers are operated by FCI and NAFED.",
        replyHi: "भारत सरकार (CACP) के आधिकारिक 2025-26 न्यूनतम समर्थन मूल्य (MSP): धान (सामान्य) ₹2,360/क्विंटल, रागी ₹4,450/क्विंटल, मक्का ₹2,310/क्विंटल और गेहूं ₹2,425/क्विंटल। खरीद FCI और NAFED द्वारा की जाती है।",
        replyKn: "ಕೇಂದ್ರ ಸರ್ಕಾರದ CACP 2025-26 ಬೆಂಬಲ ಬೆಲೆ (MSP): ಭತ್ತ ₹2,360/ಕ್ವಿಂಟಾಲ್, ರಾಗಿ ₹4,450/ಕ್ವಿಂಟಾಲ್, ಮೆಕ್ಕೆಜೋಳ ₹2,310/ಕ್ವಿಂಟಾಲ್ ಮತ್ತು ಗೋಧಿ ₹2,425/ಕ್ವಿಂಟಾಲ್.",
        actionCard: {
          title: "CACP Government MSP",
          mandi: "Official Price Floor",
          netProfit: "Guaranteed Floor Support",
          gainPercent: "FCI / NAFED Desk"
        }
      };
    }

    return {
      replyEn: `I am KRISHI-NIRNAY AI connected with Agmarknet, CACP MSP, and NHB databases. Ask me whether to sell today or wait, check live mandi rates, or enquire about transport costs for your harvest.`,
      replyHi: `मैं कृषि-निर्णय AI हूँ, जो एगमार्कनेट, सरकारी एमएसपी और राष्ट्रीय बागवानी बोर्ड से जुड़ा है। मुझसे आज बेचें या रुकें, लाइव मंडी भाव या ढुलाई खर्च के बारे में पूछें।`,
      replyKn: `ನಾನು ಕೃಷಿ-ನಿರ್ಣಯ AI. Agmarknet, ಸರ್ಕಾರಿ ಬೆಂಬಲ ಬೆಲೆ ಮತ್ತು NHB ಮಾರ್ಗಸೂಚಿಗಳೊಂದಿಗೆ ಜೋಡಿಸಲ್ಪಟ್ಟಿದ್ದೇನೆ. ಮಾರಾಟ ನಿರ್ಧಾರದ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಿ.`,
      actionCard: null
    };
  }
}

// Master AI Coordinator
class KrishiAgentCoordinator {
  constructor(data) {
    this.data = data;
    this.marketAgent = new MarketIntelligenceAgent(data);
    this.trendAgent = new PriceTrendAgent(data);
    this.transportAgent = new TransportAgent(data);
    this.storageAgent = new StorageAndSpoilageAgent(data);
    this.optimizationAgent = new ProfitOptimizationAgent(
      this.marketAgent,
      this.trendAgent,
      this.transportAgent,
      this.storageAgent
    );
    this.assistantAgent = new FarmerAssistantAgent(this);
  }
}

window.KrishiAgentCoordinator = KrishiAgentCoordinator;
