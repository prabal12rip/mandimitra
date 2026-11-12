/**
 * KRISHI-NIRNAY AI
 * FPO (Farmer Producer Organization) Collective Engine
 * Aggregation, Member Lots, Bulk Buyer Matching & Shared Logistics Optimization
 */

class FPOEngine {
  constructor(data) {
    this.data = data;
  }

  getAggregationSummary() {
    const lots = this.data.fpo.lots;
    const cropTotals = {};
    let totalKg = 0;

    lots.forEach(lot => {
      totalKg += lot.quantityKg;
      if (!cropTotals[lot.crop]) {
        cropTotals[lot.crop] = { totalKg: 0, count: 0 };
      }
      cropTotals[lot.crop].totalKg += lot.quantityKg;
      cropTotals[lot.crop].count += 1;
    });

    const logistics = this.data.fpo.groupLogistics;
    const savingsPercent = Math.round((logistics.savingsForFarmers / logistics.individualEstimatedTransportCost) * 100);

    return {
      fpoName: this.data.fpo.name,
      registrationNumber: this.data.fpo.registrationNumber,
      totalMembers: this.data.fpo.totalMembers,
      lotsCount: lots.length,
      combinedQuantityKg: totalKg,
      cropTotals: cropTotals,
      logistics: {
        individualCost: logistics.individualEstimatedTransportCost,
        pooledCost: logistics.pooledTruckTransportCost,
        savings: logistics.savingsForFarmers,
        savingsPercent: savingsPercent,
        suggestedMandi: logistics.suggestedMandi,
        bestBulkOffer: logistics.bestBulkOffer
      },
      lots: lots
    };
  }

  addMemberLot({ memberName, village, crop, quantityKg, grade = "Grade A" }) {
    const newLot = {
      id: "lot-" + (this.data.fpo.lots.length + 1),
      memberName: memberName || `Member ${this.data.fpo.lots.length + 1}`,
      village: village || "Bengaluru Rural",
      crop: crop || "Tomato",
      quantityKg: parseFloat(quantityKg),
      grade: grade
    };

    this.data.fpo.lots.push(newLot);
    this.data.fpo.combinedQuantityKg += newLot.quantityKg;
    
    // Recalculate logistics savings
    const basePerTonne = 1400;
    const totalTonnes = this.data.fpo.combinedQuantityKg / 1000;
    this.data.fpo.groupLogistics.pooledTruckTransportCost = Math.round(5000 + (totalTonnes * 550));
    this.data.fpo.groupLogistics.individualEstimatedTransportCost = Math.round(totalTonnes * 2500);
    this.data.fpo.groupLogistics.savingsForFarmers = 
      this.data.fpo.groupLogistics.individualEstimatedTransportCost - this.data.fpo.groupLogistics.pooledTruckTransportCost;

    return newLot;
  }
}

window.FPOEngine = FPOEngine;
