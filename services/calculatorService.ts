
import { Level, Region, PricingResult, ArticleType, MasterCategory, ReverseLogisticsMode, Marketplace, Brand } from '../types';
import { 
  PLATFORM_LOGISTICS_FEES, 
  REVERSE_LOGISTICS_FEES, 
  GST_RATE, 
  PRODUCT_GST_RATE,
  TCS_RATE_VAL,
  TDS_RATE_VAL,
  ARTICLE_SPECIFICATIONS,
  BRAND_COMMISSION_SLABS,
  BRAND_FIXED_FEE_SLABS,
  FREE_ITEMS_COMMISSION_SLABS
} from '../constants';

const getCommissionRate = (price: number, articleType: ArticleType, brand: Brand): number => {
  const spec = ARTICLE_SPECIFICATIONS[articleType];
  if (spec.category === MasterCategory.FREE_ITEMS) {
    const slab = FREE_ITEMS_COMMISSION_SLABS.find(s => price >= s.lower && price <= s.upper) || FREE_ITEMS_COMMISSION_SLABS[0];
    return slab.rate;
  }

  const brandRules = BRAND_COMMISSION_SLABS[brand] || BRAND_COMMISSION_SLABS.default;
  // Prioritize Article-Specific -> Brand ALL -> Default ALL
  const articleRules = brandRules[articleType] || brandRules.ALL || BRAND_COMMISSION_SLABS.default.ALL;
  
  const slab = articleRules.find(s => price >= s.lower && price < s.upper) || articleRules[articleRules.length - 1];
  return slab.rate;
};

const getFixedFee = (aisp: number, articleType: ArticleType, brand: Brand): number => {
  const brandRules = BRAND_FIXED_FEE_SLABS[brand] || BRAND_FIXED_FEE_SLABS.default;
  // Prioritize Article-Specific -> Brand ALL -> Default ALL
  const articleRules = brandRules[articleType] || brandRules.ALL || BRAND_FIXED_FEE_SLABS.default.ALL;
  
  const slab = articleRules.find(s => aisp >= s.lower && aisp < s.upper) || articleRules[articleRules.length - 1];
  return slab.fee;
};

export const calculateAjioBreakdown = (
  bankSettlement: number,
  ajioMarginPercent: number = 34,
  tradeDiscountPercent: number = 65
): PricingResult => {
  let gstOnPurchasePercent = 0.05;
  let purchasePrice = bankSettlement / (1 + gstOnPurchasePercent);
  
  if (purchasePrice > 1000) {
    gstOnPurchasePercent = 0.12;
    purchasePrice = bankSettlement / (1 + gstOnPurchasePercent);
  }
  const gstOnPurchaseAmt = bankSettlement - purchasePrice;

  let gstOnAspPercent = 0.05;
  let marginRate = ajioMarginPercent / 100;
  let aspGross = purchasePrice / ( (1 / (1 + gstOnAspPercent)) - marginRate );
  
  if (aspGross > 1000) {
    gstOnAspPercent = 0.12;
    aspGross = purchasePrice / ( (1 / (1 + gstOnAspPercent)) - marginRate );
  }

  const gstOnAspAmt = aspGross - (aspGross / (1 + gstOnAspPercent));
  const netSalesValue = aspGross - gstOnAspAmt;
  const ajioMarginAmt = aspGross * marginRate;

  const tradeDiscountRate = tradeDiscountPercent / 100;
  const mrp = tradeDiscountRate < 1 ? aspGross / (1 - tradeDiscountRate) : aspGross;
  const saleDiscountAmt = mrp - aspGross;

  return {
    aisp: aspGross,
    customerPrice: aspGross,
    commissionRate: ajioMarginPercent,
    commission: ajioMarginAmt,
    fixedFee: 0,
    logisticsFee: 0,
    reverseLogisticsFee: 0,
    reverseMode: ReverseLogisticsMode.FIXED,
    gstOnFees: 0,
    tcs: 0,
    tds: 0,
    totalActualSettlement: bankSettlement,
    marketplace: Marketplace.AJIO,
    mrp,
    tradeDiscountPercent,
    saleDiscountAmt,
    aspGross,
    gstOnAspPercent: gstOnAspPercent * 100,
    gstOnAspAmt,
    netSalesValue,
    purchasePrice,
    gstOnPurchasePercent: gstOnPurchasePercent * 100,
    gstOnPurchaseAmt
  };
};

export const calculateBreakdown = (
  aisp: number, 
  level: Level,
  articleType: ArticleType,
  isReverseLogistics: boolean,
  reverseRegion: Region,
  reverseMode: ReverseLogisticsMode = ReverseLogisticsMode.FIXED,
  reversePercent: number = 0,
  marketplace: Marketplace = Marketplace.MYNTRA,
  brand: Brand = Brand.BELLSTONE,
  ajioMargin?: number,
  ajioTradeDiscount?: number
): PricingResult => {
  if (marketplace === Marketplace.AJIO) {
    return calculateAjioBreakdown(aisp, ajioMargin, ajioTradeDiscount);
  }

  const gtaFees = PLATFORM_LOGISTICS_FEES[level];
  const LOGISTICS_SLABS = [ { min: 0, max: 299 }, { min: 300, max: 499 }, { min: 500, max: 999 }, { min: 1000, max: 1999 }, { min: 2000, max: Infinity } ];
  let gtaFee = gtaFees[1]; 

  for (let i = 0; i < LOGISTICS_SLABS.length; i++) {
    const feeCandidate = gtaFees[i + 1]; 
    const range = LOGISTICS_SLABS[i];
    const potentialCP = aisp + feeCandidate;
    if (potentialCP >= range.min - 0.001 && potentialCP <= range.max + 0.001) {
      gtaFee = feeCandidate;
      break;
    }
  }

  const customerPrice = aisp + gtaFee;
  // Commission uses Customer Price (AISP + Logistics)
  const commissionRate = getCommissionRate(customerPrice, articleType, brand);
  const commission = (aisp * commissionRate) / 100;
  // Fixed Fee uses AISP (Selling Price)
  const fixedFee = getFixedFee(aisp, articleType, brand);

  let reverseLogisticsFee = 0;
  if (isReverseLogistics) {
    if (reverseMode === ReverseLogisticsMode.FIXED) {
      reverseLogisticsFee = REVERSE_LOGISTICS_FEES[level][reverseRegion];
    } else {
      reverseLogisticsFee = (aisp * reversePercent) / 100;
    }
  }

  const taxableValue = aisp / (1 + PRODUCT_GST_RATE);
  const tcs = taxableValue * TCS_RATE_VAL;
  const tds = taxableValue * TDS_RATE_VAL;
  const gstOnFixedFee = fixedFee * GST_RATE;
  const gstOnReverse = reverseLogisticsFee * GST_RATE;
  const totalActualSettlement = aisp - commission - fixedFee - gstOnFixedFee - tcs - tds - reverseLogisticsFee - gstOnReverse;

  return {
    aisp, customerPrice, commissionRate, commission, fixedFee, logisticsFee: gtaFee,
    reverseLogisticsFee, reverseMode, reversePercent, gstOnFees: gstOnFixedFee + gstOnReverse,
    tcs, tds, totalActualSettlement, marketplace: Marketplace.MYNTRA, brand
  };
};

export const findAISPForTarget = (
  target: number,
  level: Level,
  articleType: ArticleType,
  isReverseLogistics: boolean,
  reverseRegion: Region,
  reverseMode: ReverseLogisticsMode = ReverseLogisticsMode.FIXED,
  reversePercent: number = 0,
  marketplace: Marketplace = Marketplace.MYNTRA,
  brand: Brand = Brand.BELLSTONE,
  ajioMargin?: number,
  ajioTradeDiscount?: number
): number => {
  if (marketplace === Marketplace.AJIO) {
    const res = calculateAjioBreakdown(target, ajioMargin, ajioTradeDiscount);
    return res.aisp;
  }

  let bestAisp = 0;
  let minDiff = Infinity;

  for (let potentialAisp = target; potentialAisp < target * 3; potentialAisp += 0.05) {
    const res = calculateBreakdown(potentialAisp, level, articleType, isReverseLogistics, reverseRegion, reverseMode, reversePercent, Marketplace.MYNTRA, brand);
    const diff = Math.abs(res.totalActualSettlement - target);
    if (diff < minDiff) {
      minDiff = diff;
      bestAisp = potentialAisp;
    } else if (diff > minDiff && potentialAisp > target + 50) {
      break; 
    }
  }
  return bestAisp;
};
