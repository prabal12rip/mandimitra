/**
 * KRISHI-NIRNAY AI
 * Marketplace & Transaction Engine
 * Listings, Offers, Negotiation, Order Milestones, Payments, and Disputes
 */

class MarketplaceEngine {
  constructor(data, coordinator) {
    this.data = data;
    this.coordinator = coordinator;
  }

  createListing({
    cropId,
    cropName,
    variety,
    quantityKg,
    askingPrice,
    grade = "Grade A",
    harvestDate,
    location = "Doddaballapur, Bengaluru Rural",
    notes = ""
  }) {
    const newListing = {
      id: "list-" + Date.now(),
      farmerName: "Arkit Jha",
      farmerVillage: location,
      cropId: cropId,
      cropName: cropName || "Tomato (Local)",
      variety: variety || "Local Farm Fresh",
      quantityKg: parseFloat(quantityKg),
      askingPrice: parseFloat(askingPrice),
      grade: grade,
      harvestDate: harvestDate || "15 Nov 2026",
      status: "Published",
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      images: ["🍅 Fresh Harvest Lot", "🍅 Crates packed"],
      notes: notes,
      offersCount: 0,
      offers: []
    };

    this.data.marketplaceListings.unshift(newListing);
    return newListing;
  }

  submitBuyerOffer({
    listingId,
    buyerName,
    offerPrice,
    requestedQty,
    transportMode = "Buyer Pickup at Farm Gate",
    transportCost = 0,
    paymentTerms = "30% Advance, 70% upon delivery"
  }) {
    const listing = this.data.marketplaceListings.find(l => l.id === listingId);
    if (!listing) return null;

    const netReturn = (offerPrice * requestedQty) - transportCost;
    const newOffer = {
      id: "off-" + Date.now(),
      buyerId: "buyer-" + Math.floor(Math.random() * 900 + 100),
      buyerName: buyerName || "Verified Agro Processor",
      buyerRating: 4.7,
      isVerified: true,
      offerPrice: parseFloat(offerPrice),
      requestedQty: parseFloat(requestedQty),
      transportMode: transportMode,
      transportCostToFarmer: transportCost,
      paymentTerms: paymentTerms,
      netReturn: netReturn,
      distanceKm: 15,
      expiresInHours: 24,
      status: "Pending"
    };

    listing.offers.push(newOffer);
    listing.offersCount = listing.offers.length;
    return newOffer;
  }

  acceptOffer(listingId, offerId) {
    const listing = this.data.marketplaceListings.find(l => l.id === listingId);
    if (!listing) return null;

    const offer = listing.offers.find(o => o.id === offerId);
    if (!offer) return null;

    offer.status = "Accepted";
    listing.status = "Sold";

    // Create new active order
    const totalVal = offer.offerPrice * offer.requestedQty;
    const advance = Math.round(totalVal * 0.25);
    const orderId = "KN-" + Math.floor(Math.random() * 9000 + 1000);

    const newOrder = {
      orderId: orderId,
      cropName: `${listing.cropName} (${offer.requestedQty} kg)`,
      quantityKg: offer.requestedQty,
      totalValue: totalVal,
      buyerName: offer.buyerName,
      orderStatus: "Pickup Scheduled",
      orderDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      eta: "Within 48 hours",
      deliveryAddress: "Direct buyer pickup agreed at farm gate",
      milestones: [
        { title: "Offer Accepted", date: "Just now", completed: true },
        { title: "Pickup Scheduled", date: "Pending slot confirmation", completed: true },
        { title: "Produce Dispatched", date: "Scheduled", completed: false },
        { title: "Buyer Received & Verified", date: "Pending", completed: false }
      ],
      paymentStatus: {
        total: totalVal,
        advancePaid: advance,
        deliveryPending: totalVal - advance,
        finalBalance: 0,
        status: "Advance Received",
        receiptId: "REC-" + Date.now().toString().slice(-6),
        paymentMethod: "Direct Escrow Bank Transfer"
      }
    };

    this.data.orders.unshift(newOrder);
    return newOrder;
  }

  counterOffer(listingId, offerId, counterPrice) {
    const listing = this.data.marketplaceListings.find(l => l.id === listingId);
    if (!listing) return null;

    const offer = listing.offers.find(o => o.id === offerId);
    if (!offer) return null;

    offer.status = "Countered";
    offer.counterPrice = parseFloat(counterPrice);
    offer.netReturn = (offer.counterPrice * offer.requestedQty) - offer.transportCostToFarmer;
    return offer;
  }

  advanceOrderMilestone(orderId) {
    const order = this.data.orders.find(o => o.orderId === orderId);
    if (!order) return null;

    if (order.orderStatus === "Pickup Scheduled") {
      order.orderStatus = "In Transit";
      order.milestones[2].completed = true;
      order.milestones[2].date = "Dispatched today";
    } else if (order.orderStatus === "In Transit") {
      order.orderStatus = "Delivered";
      order.milestones[3].completed = true;
      order.milestones[3].date = "Delivered & verified";
      order.paymentStatus.status = "Full Payment Released";
      order.paymentStatus.deliveryPending = 0;
    }

    return order;
  }

  raiseDispute({ orderId, buyerName, issueType, evidence }) {
    const dispute = {
      id: "disp-" + Date.now().toString().slice(-4),
      orderId: orderId || "KN-1042",
      buyerName: buyerName || "ABC Foods",
      issueType: issueType || "Payment delay",
      evidence: evidence || "Dispute submitted with bill slip",
      status: "Under review",
      raisedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      workflowStage: "Notified APMC dispute resolution desk"
    };

    this.data.disputes.unshift(dispute);
    return dispute;
  }
}

window.MarketplaceEngine = MarketplaceEngine;
