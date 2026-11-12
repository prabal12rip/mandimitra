/**
 * KRISHI-NIRNAY AI (Mandi Mitra)
 * Seed Data & State Model
 * Problem Statement 6.1: Tech4Bharat 2026 - Helping farmers sell at the right time, place and price.
 */

const SEED_DATA = {
  lastUpdated: "10 Nov 2026, 09:30 AM",
  source: "Agmarknet / Karnataka State Agricultural Marketing Board (Illustrative Data)",

  crops: [
    {
      id: "tomato",
      name: "Tomato (Local)",
      category: "Perishable Vegetable",
      perishability: "High",
      basePrice: 22.50, // Rs/kg
      unit: "kg",
      quintalMultiplier: 100,
      shelfLifeDays: 4,
      dailyAmbientSpoilage: 0.08, // 8% per day ambient
      dailyColdSpoilage: 0.005,  // 0.5% per day cold storage
      dailyStorageCostPerKg: 1.50, // Rs/kg/day
      icon: "🍅",
      description: "Fast-moving perishable crop. Susceptible to heat and transit damage.",
      historical: [
        { month: "Jun", price: 16.80, min: 14.50, max: 19.20, volume: "1,200 tonnes" },
        { month: "Jul", price: 18.40, min: 16.00, max: 21.00, volume: "1,450 tonnes" },
        { month: "Aug", price: 19.90, min: 17.50, max: 22.30, volume: "1,600 tonnes" },
        { month: "Sep", price: 20.80, min: 18.20, max: 23.50, volume: "1,380 tonnes" },
        { month: "Oct", price: 21.70, min: 19.00, max: 24.50, volume: "1,520 tonnes" },
        { month: "Nov", price: 22.50, min: 19.50, max: 26.50, volume: "1,750 tonnes" }
      ],
      forecast: {
        currentPrice: 22.50,
        rangeMin: 24.00,
        rangeMax: 26.00,
        trend: "Possible upward trend",
        confidence: "Medium",
        factors: ["Diwali post-festival demand surge", "Slight arrivals dip from neighbouring taluks", "Weather clear for 2 days"]
      }
    },
    {
      id: "potato",
      name: "Potato (Jyoti)",
      category: "Semi-perishable Vegetable",
      perishability: "Moderate",
      basePrice: 18.00,
      unit: "kg",
      quintalMultiplier: 100,
      shelfLifeDays: 30,
      dailyAmbientSpoilage: 0.015,
      dailyColdSpoilage: 0.001,
      dailyStorageCostPerKg: 0.60,
      icon: "🥔",
      description: "Storable root crop. Good shelf life in ventilated sheds.",
      historical: [
        { month: "Jun", price: 14.20, min: 12.00, max: 16.00, volume: "2,400 tonnes" },
        { month: "Jul", price: 15.50, min: 13.50, max: 17.50, volume: "2,200 tonnes" },
        { month: "Aug", price: 16.80, min: 14.20, max: 18.50, volume: "2,100 tonnes" },
        { month: "Sep", price: 17.20, min: 15.00, max: 19.00, volume: "1,950 tonnes" },
        { month: "Oct", price: 17.80, min: 15.50, max: 20.20, volume: "2,300 tonnes" },
        { month: "Nov", price: 18.00, min: 16.00, max: 21.00, volume: "2,500 tonnes" }
      ],
      forecast: {
        currentPrice: 18.00,
        rangeMin: 18.50,
        rangeMax: 19.80,
        trend: "Stable to mild rise",
        confidence: "High",
        factors: ["Consistent arrivals from Hassan", "Normal consumer demand"]
      }
    },
    {
      id: "onion",
      name: "Onion (Nashik Red)",
      category: "Semi-perishable Vegetable",
      perishability: "Moderate",
      basePrice: 31.00,
      unit: "kg",
      quintalMultiplier: 100,
      shelfLifeDays: 20,
      dailyAmbientSpoilage: 0.02,
      dailyColdSpoilage: 0.002,
      dailyStorageCostPerKg: 0.80,
      icon: "🧅",
      description: "Sensitive to moisture. Price fluctuations common.",
      historical: [
        { month: "Jun", price: 22.00, min: 18.00, max: 25.00, volume: "3,100 tonnes" },
        { month: "Jul", price: 24.50, min: 20.00, max: 28.00, volume: "2,800 tonnes" },
        { month: "Aug", price: 27.00, min: 23.00, max: 30.50, volume: "2,600 tonnes" },
        { month: "Sep", price: 29.20, min: 25.00, max: 32.00, volume: "2,400 tonnes" },
        { month: "Oct", price: 30.50, min: 26.00, max: 34.00, volume: "2,700 tonnes" },
        { month: "Nov", price: 31.00, min: 27.50, max: 36.00, volume: "2,900 tonnes" }
      ],
      forecast: {
        currentPrice: 31.00,
        rangeMin: 32.50,
        rangeMax: 35.00,
        trend: "Upward trend",
        confidence: "Medium",
        factors: ["Late monsoon delay in central India harvest", "High wholesale bidding"]
      }
    },
    {
      id: "paddy",
      name: "Paddy (Sona Masoori)",
      category: "Durable Grain",
      perishability: "Low",
      basePrice: 24.80, // ~Rs 2,480/quintal
      unit: "kg",
      quintalMultiplier: 100,
      shelfLifeDays: 180,
      dailyAmbientSpoilage: 0.0005,
      dailyColdSpoilage: 0.0001,
      dailyStorageCostPerKg: 0.20,
      icon: "🌾",
      description: "Durable cereal grain. Can be stored safely for months if dry.",
      historical: [
        { month: "Jun", price: 23.10, min: 22.00, max: 24.50, volume: "4,500 tonnes" },
        { month: "Jul", price: 23.50, min: 22.50, max: 24.80, volume: "4,200 tonnes" },
        { month: "Aug", price: 23.90, min: 22.80, max: 25.00, volume: "3,900 tonnes" },
        { month: "Sep", price: 24.20, min: 23.00, max: 25.20, volume: "3,800 tonnes" },
        { month: "Oct", price: 24.50, min: 23.50, max: 25.80, volume: "4,100 tonnes" },
        { month: "Nov", price: 24.80, min: 23.80, max: 26.20, volume: "4,600 tonnes" }
      ],
      forecast: {
        currentPrice: 24.80,
        rangeMin: 25.00,
        rangeMax: 26.00,
        trend: "Firm & Steady",
        confidence: "High",
        factors: ["Government MSP support baseline", "Steady mill procurement"]
      }
    },
    {
      id: "ragi",
      name: "Ragi (Finger Millet)",
      category: "Durable Grain",
      perishability: "Low",
      basePrice: 32.00,
      unit: "kg",
      quintalMultiplier: 100,
      shelfLifeDays: 365,
      dailyAmbientSpoilage: 0.0002,
      dailyColdSpoilage: 0.0001,
      dailyStorageCostPerKg: 0.25,
      icon: "🌱",
      description: "Nutri-cereal with extreme durability. High health food demand.",
      historical: [
        { month: "Jun", price: 29.50, min: 28.00, max: 31.00, volume: "1,100 tonnes" },
        { month: "Jul", price: 30.20, min: 28.50, max: 31.50, volume: "1,050 tonnes" },
        { month: "Aug", price: 30.80, min: 29.00, max: 32.20, volume: "980 tonnes" },
        { month: "Sep", price: 31.20, min: 29.50, max: 33.00, volume: "1,020 tonnes" },
        { month: "Oct", price: 31.70, min: 30.00, max: 33.50, volume: "1,150 tonnes" },
        { month: "Nov", price: 32.00, min: 30.50, max: 34.00, volume: "1,300 tonnes" }
      ],
      forecast: {
        currentPrice: 32.00,
        rangeMin: 32.50,
        rangeMax: 33.80,
        trend: "Steady upward",
        confidence: "High",
        factors: ["Rising urban demand for millets", "Procurement scheme active"]
      }
    }
  ],

  mandis: [
    {
      id: "mandi-bengaluru-rural",
      name: "Bengaluru Rural (Yeshwantpur / APMC)",
      location: "Bengaluru Rural",
      distanceKm: 12,
      updatedAt: "Today 8:45 AM",
      verified: true,
      cropPrices: {
        tomato: { pricePerKg: 22.50, change: "+3.2%", trend: "up" },
        potato: { pricePerKg: 18.00, change: "+1.1%", trend: "up" },
        onion: { pricePerKg: 31.00, change: "+2.4%", trend: "up" },
        paddy: { pricePerKg: 24.80, change: "+0.5%", trend: "up" },
        ragi: { pricePerKg: 32.00, change: "+1.0%", trend: "up" }
      },
      transportRates: {
        baseFare: 300,
        costPerKmPerTonne: 50,
        typicalCostFor500Kg: 900
      },
      contact: "APMC Yard, Gate 2, Ph: 080-2337-8901",
      amenities: ["Electronic Weighbridge", "Cold Storage Partner Yard", "Covered Sheds"]
    },
    {
      id: "mandi-kolar",
      name: "Kolar Mandi (APMC Kolar)",
      location: "Kolar Market",
      distanceKm: 35,
      updatedAt: "Today 8:20 AM",
      verified: true,
      cropPrices: {
        tomato: { pricePerKg: 21.80, change: "+1.8%", trend: "up" },
        potato: { pricePerKg: 17.50, change: "-0.5%", trend: "down" },
        onion: { pricePerKg: 30.20, change: "+1.0%", trend: "up" },
        paddy: { pricePerKg: 24.40, change: "0.0%", trend: "neutral" },
        ragi: { pricePerKg: 31.50, change: "+0.8%", trend: "up" }
      },
      transportRates: {
        baseFare: 400,
        costPerKmPerTonne: 45,
        typicalCostFor500Kg: 1800
      },
      contact: "Tomato Market Yard, Kolar, Ph: 08152-224411",
      amenities: ["Asia's 2nd largest Tomato Market", "Direct B2B Traders", "Grading Area"]
    },
    {
      id: "mandi-hosur",
      name: "Hosur Mandi (Border Market)",
      location: "Hosur Outer Ring Road",
      distanceKm: 40,
      updatedAt: "Today 8:30 AM",
      verified: true,
      cropPrices: {
        tomato: { pricePerKg: 22.00, change: "+2.1%", trend: "up" },
        potato: { pricePerKg: 18.20, change: "+1.5%", trend: "up" },
        onion: { pricePerKg: 31.50, change: "+3.0%", trend: "up" },
        paddy: { pricePerKg: 25.00, change: "+1.2%", trend: "up" },
        ragi: { pricePerKg: 31.80, change: "+0.5%", trend: "up" }
      },
      transportRates: {
        baseFare: 500,
        costPerKmPerTonne: 48,
        typicalCostFor500Kg: 2100
      },
      contact: "Interstate Agri Market, Hosur, Ph: 04344-245600",
      amenities: ["Interstate Buyers (Tamil Nadu / Kerala)", "Express Weighment"]
    },
    {
      id: "mandi-ramanagara",
      name: "Ramanagara APMC",
      location: "Ramanagara City",
      distanceKm: 48,
      updatedAt: "Today 8:10 AM",
      verified: true,
      cropPrices: {
        tomato: { pricePerKg: 21.40, change: "-0.8%", trend: "down" },
        potato: { pricePerKg: 17.20, change: "-1.2%", trend: "down" },
        onion: { pricePerKg: 29.80, change: "0.0%", trend: "neutral" },
        paddy: { pricePerKg: 24.30, change: "+0.2%", trend: "up" },
        ragi: { pricePerKg: 32.20, change: "+1.5%", trend: "up" }
      },
      transportRates: {
        baseFare: 550,
        costPerKmPerTonne: 46,
        typicalCostFor500Kg: 2300
      },
      contact: "APMC Yard, Ijoor, Ramanagara, Ph: 080-2727-1199",
      amenities: ["Local Retail Aggregators", "Fair Scale Certified"]
    }
  ],

  // Farmer's stored crops
  farmerCrops: [
    {
      id: "crop-1",
      cropId: "tomato",
      cropName: "Tomato (Local Hybrid)",
      variety: "Arka Rakshak",
      quantityKg: 1000,
      fieldArea: "1.5 Acres",
      sowingDate: "2026-08-20",
      harvestDate: "2026-11-15",
      stage: "Ready", // Growing | Ready | Harvested
      daysToHarvest: 5,
      qualityGrade: "Grade A",
      storageAvailable: false,
      urgentCashNeeded: false,
      notes: "High firmness, uniform deep red color. Ready for market harvest."
    },
    {
      id: "crop-2",
      cropId: "paddy",
      cropName: "Paddy",
      variety: "Sona Masoori",
      quantityKg: 500,
      fieldArea: "1.0 Acre",
      sowingDate: "2026-07-10",
      harvestDate: "2026-11-20",
      stage: "Growing",
      daysToHarvest: 10,
      qualityGrade: "Grade A",
      storageAvailable: true,
      urgentCashNeeded: false,
      notes: "Golden grain maturity reaching 85%. Good moisture balance."
    },
    {
      id: "crop-3",
      cropId: "ragi",
      cropName: "Ragi",
      variety: "GPU-28",
      quantityKg: 250,
      fieldArea: "0.75 Acre",
      sowingDate: "2026-07-25",
      harvestDate: "2026-11-28",
      stage: "Growing",
      daysToHarvest: 18,
      qualityGrade: "Grade A",
      storageAvailable: true,
      urgentCashNeeded: false,
      notes: "Organic manure fed. High yield expected."
    }
  ],

  // Farmer's listed produce on Marketplace
  marketplaceListings: [
    {
      id: "list-101",
      farmerName: "Arkit Jha",
      farmerVillage: "Doddaballapur, Bengaluru Rural",
      cropId: "tomato",
      cropName: "Tomato (Fresh Farm)",
      quantityKg: 1000,
      askingPrice: 25.00,
      grade: "Grade A",
      harvestDate: "15 Nov 2026",
      status: "Published", // Draft | Published | Sold
      createdAt: "10 Nov 2026",
      images: ["🍅 Fresh Harvest Lot #1", "🍅 Crates packed #2", "🍅 Grading check #3"],
      offersCount: 3,
      offers: [
        {
          id: "off-1",
          buyerId: "buyer-abc",
          buyerName: "ABC Foods & Logistics",
          buyerRating: 4.8,
          isVerified: true,
          offerPrice: 25.00,
          requestedQty: 1000,
          transportMode: "Buyer Pickup at Farm Gate",
          transportCostToFarmer: 0,
          paymentTerms: "30% Advance (₹7,500), 70% upon loading",
          netReturn: 25000,
          distanceKm: 18,
          expiresInHours: 24,
          status: "Pending" // Pending | Accepted | Rejected | Countered
        },
        {
          id: "off-2",
          buyerId: "buyer-freshmart",
          buyerName: "FreshMart Retail chain",
          buyerRating: 4.6,
          isVerified: true,
          offerPrice: 24.00,
          requestedQty: 500,
          transportMode: "Farmer Delivery to Warehouse",
          transportCostToFarmer: 900,
          paymentTerms: "100% Direct Bank Transfer within 24h",
          netReturn: 11100, // (500*24) - 900
          distanceKm: 12,
          expiresInHours: 18,
          status: "Pending"
        },
        {
          id: "off-3",
          buyerId: "buyer-trader",
          buyerName: "K.R. Market Wholesale Trader",
          buyerRating: 4.2,
          isVerified: false,
          offerPrice: 23.00,
          requestedQty: 1000,
          transportMode: "Farmer Delivery to Yard",
          transportCostToFarmer: 1200,
          paymentTerms: "Cash upon receipt",
          netReturn: 21800,
          distanceKm: 22,
          expiresInHours: 12,
          status: "Pending"
        }
      ]
    }
  ],

  // Orders pipeline
  orders: [
    {
      orderId: "KN-1042",
      cropName: "Tomato (Local Grade A)",
      quantityKg: 1000,
      totalValue: 25000,
      buyerName: "ABC Foods & Logistics",
      orderStatus: "In Transit", // Confirmed | Pickup Scheduled | In Transit | Delivered
      orderDate: "09 Nov 2026",
      eta: "Tomorrow, 11 Nov 2026, 11:00 AM",
      deliveryAddress: "Hubli Cold Logistics Center, Bengaluru North",
      milestones: [
        { title: "Offer Accepted", date: "09 Nov, 10:30 AM", completed: true },
        { title: "Pickup Scheduled", date: "09 Nov, 03:00 PM", completed: true },
        { title: "Produce Dispatched", date: "10 Nov, 08:00 AM", completed: true },
        { title: "Buyer Received & Verified", date: "Pending receipt", completed: false }
      ],
      paymentStatus: {
        total: 25000,
        advancePaid: 5000,
        deliveryPending: 15000,
        finalBalance: 5000,
        status: "Part-paid",
        receiptId: "REC-2026-9884",
        paymentMethod: "UPI / Bank Transfer Escrow"
      }
    }
  ],

  // Buyer registered data
  buyers: [
    {
      id: "buyer-abc",
      name: "ABC Foods & Logistics",
      category: "Food Processor & Exporter",
      location: "Bengaluru Peenya Industrial Area",
      verificationStatus: "Verified",
      gst: "29AABCU9603R1ZM",
      rating: 4.8,
      dealsCompleted: 142,
      requirements: [
        { crop: "Tomato", qty: "2,000 kg", maxPrice: 26.00, quality: "Grade A" },
        { crop: "Potato", qty: "5,000 kg", maxPrice: 19.50, quality: "Medium" }
      ]
    },
    {
      id: "buyer-freshmart",
      name: "FreshMart Retail chain",
      category: "Supermarket Procurement",
      location: "Bengaluru Whitefield Distribution",
      verificationStatus: "Verified",
      gst: "29AABCF4411Q1ZN",
      rating: 4.6,
      dealsCompleted: 88,
      requirements: [
        { crop: "Tomato", qty: "1,500 kg", maxPrice: 24.50, quality: "Grade A fresh" },
        { crop: "Onion", qty: "3,000 kg", maxPrice: 32.00, quality: "Grade A" }
      ]
    },
    {
      id: "buyer-trader",
      name: "Local Commission Trader",
      category: "APMC Wholesale Agent",
      location: "Yeshwantpur Sub-yard",
      verificationStatus: "Under review",
      gst: "Pending Submission",
      rating: 4.2,
      dealsCompleted: 15,
      requirements: [
        { crop: "Paddy", qty: "10,000 kg", maxPrice: 25.50, quality: "Standard" }
      ]
    }
  ],

  // FPO (Farmer Producer Organization) Collective Pool
  fpo: {
    name: "Doddaballapur Krishi Vikas FPO",
    registrationNumber: "FPO-KA-2023-0941",
    totalMembers: 24,
    combinedQuantityKg: 6200,
    lots: [
      { id: "lot-1", memberName: "Member 01 (Ramesh Patil)", village: "Heggadehalli", crop: "Tomato", quantityKg: 500, grade: "Grade A" },
      { id: "lot-2", memberName: "Member 02 (Suresh Gowda)", village: "Aralumallige", crop: "Tomato", quantityKg: 300, grade: "Grade A" },
      { id: "lot-3", memberName: "Member 03 (Anjanappa)", village: "Rajaghatta", crop: "Paddy", quantityKg: 1200, grade: "Sona Masoori" },
      { id: "lot-4", memberName: "Member 04 (Lakshmi Devi)", village: "Heggadehalli", crop: "Tomato", quantityKg: 400, grade: "Grade B" },
      { id: "lot-5", memberName: "Member 05 (Manjunath)", village: "Tubagere", crop: "Paddy", quantityKg: 1600, grade: "Sona Masoori" },
      { id: "lot-6", memberName: "Member 06 (Basavaraj)", village: "Sasalu", crop: "Ragi", quantityKg: 1000, grade: "GPU-28" },
      { id: "lot-7", memberName: "Member 07 (Venkatesh)", village: "Aralumallige", crop: "Tomato", quantityKg: 1200, grade: "Grade A" }
    ],
    groupLogistics: {
      individualEstimatedTransportCost: 15600, // if everyone took separate auto/small tempo
      pooledTruckTransportCost: 8400, // single 10-wheel / 6-wheel aggregate truck
      savingsForFarmers: 7200, // ~46% savings!
      suggestedMandi: "Bengaluru Rural (Yeshwantpur APMC)",
      bestBulkOffer: "ABC Foods (Direct Bulk ₹25.20/kg)"
    }
  },

  // Weather & Harvest alerts
  alerts: [
    {
      id: "alt-1",
      type: "rain",
      severity: "warning",
      title: "Rain Alert: Possible in Next 48 Hours",
      body: "Moderate showers forecast in Bengaluru Rural & Kolar belt. If harvesting tomatoes or onions, arrange waterproof covers or postpone picking by 24h.",
      icon: "🌧️",
      time: "2 hours ago"
    },
    {
      id: "alt-2",
      type: "harvest",
      severity: "info",
      title: "Harvest Readiness Reminder: Tomato",
      body: "Your 1,000 kg Tomato plot reaches optimal color in 5 days. Benchmark current mandi prices to plan buyers.",
      icon: "🍅",
      time: "5 hours ago"
    },
    {
      id: "alt-3",
      type: "market",
      severity: "success",
      title: "Price Surge in Bengaluru Rural",
      body: "Bengaluru Rural mandi prices for Tomato rose +3.2% today (₹22.50/kg). Hosur mandi also trending upwards.",
      icon: "📈",
      time: "Today 08:50 AM"
    },
    {
      id: "alt-4",
      type: "transport",
      severity: "warning",
      title: "Route Disruption Advisory",
      body: "Road widening near Hoskote toll may add 35 minutes travel time. Plan early morning transit if heading to Kolar.",
      icon: "🚚",
      time: "Yesterday"
    }
  ],

  // Ratings and Disputes
  disputes: [
    {
      id: "disp-101",
      orderId: "KN-0994",
      buyerName: "Southern Agro Traders",
      issueType: "Payment delay",
      evidence: "Unpaid balance receipt #8812 (₹4,500 pending over 7 days)",
      status: "In progress",
      raisedDate: "05 Nov 2026",
      workflowStage: "Support case escalated to APMC mediator"
    }
  ]
};

// Expose state and helper functions
window.KRISHI_DATA = SEED_DATA;
