import { ResourceInfo, ResourceType, CityId, AllMarketPrices } from '../types/albion';

export const CITIES: Record<CityId, {
  name: string;
  nameArabic: string;
  bonusResource: ResourceType | null;
  badge: string;
}> = {
  martlock: {
    name: 'Martlock',
    nameArabic: 'مارتلوك',
    bonusResource: 'leather',
    badge: 'Leather (+40%)'
  },
  lymhurst: {
    name: 'Lymhurst',
    nameArabic: 'ليمهرست',
    bonusResource: 'cloth',
    badge: 'Cloth (+40%)'
  },
  thetford: {
    name: 'Thetford',
    nameArabic: 'ثيتفورد',
    bonusResource: 'metal',
    badge: 'Ore (+40%)'
  },
  fort_sterling: {
    name: 'Fort Sterling',
    nameArabic: 'فورت ستيرلينغ',
    bonusResource: 'wood',
    badge: 'Wood (+40%)'
  },
  bridgewatch: {
    name: 'Bridgewatch',
    nameArabic: 'بريدج ووتش',
    bonusResource: 'stone',
    badge: 'Stone (+40%)'
  },
  caerleon: {
    name: 'Caerleon',
    nameArabic: 'كارليون',
    bonusResource: null,
    badge: 'Red Zone Hub'
  }
};

export const RESOURCES: Record<ResourceType, ResourceInfo> = {
  leather: {
    id: 'leather',
    name: 'Leather',
    nameArabic: 'الجلود',
    t2RawName: 'Rugged Hide (T2)',
    t2RefinedName: 'Stiff Leather (T2)',
    t3RawName: 'Thick Hide (T3)',
    t3RefinedName: 'Thick Leather (T3)',
    bonusCity: 'martlock'
  },
  wood: {
    id: 'wood',
    name: 'Wood',
    nameArabic: 'الخشب',
    t2RawName: 'Birch Logs (T2)',
    t2RefinedName: 'Birch Planks (T2)',
    t3RawName: 'Chestnut Logs (T3)',
    t3RefinedName: 'Chestnut Planks (T3)',
    bonusCity: 'fort_sterling'
  },
  cloth: {
    id: 'cloth',
    name: 'Cloth',
    nameArabic: 'القماش',
    t2RawName: 'Cotton (T2)',
    t2RefinedName: 'Simple Cloth (T2)',
    t3RawName: 'Flax (T3)',
    t3RefinedName: 'Neat Cloth (T3)',
    bonusCity: 'lymhurst'
  },
  metal: {
    id: 'metal',
    name: 'Ore',
    nameArabic: 'المعادن',
    t2RawName: 'Copper Ore (T2)',
    t2RefinedName: 'Copper Bar (T2)',
    t3RawName: 'Tin Ore (T3)',
    t3RefinedName: 'Bronze Bar (T3)',
    bonusCity: 'thetford'
  },
  stone: {
    id: 'stone',
    name: 'Stone',
    nameArabic: 'الحجارة',
    t2RawName: 'Limestone (T2)',
    t2RefinedName: 'Limestone Block (T2)',
    t3RawName: 'Sandstone (T3)',
    t3RefinedName: 'Sandstone Block (T3)',
    bonusCity: 'bridgewatch'
  }
};

export const DEFAULT_MARKET_PRICES: AllMarketPrices = {
  leather: {
    martlock: {
      t2RawBuyOrder: 14, t2RawSellOrder: 17,
      t3RawBuyOrder: 34, t3RawSellOrder: 39,
      t2RefinedBuyOrder: 22, t2RefinedSellOrder: 26, t2BuyOrder: 22,
      t3RefinedBuyOrder: 110, t3RefinedSellOrder: 125,
      stationFee: 6
    },
    lymhurst: {
      t2RawBuyOrder: 13, t2RawSellOrder: 16,
      t3RawBuyOrder: 36, t3RawSellOrder: 42,
      t2RefinedBuyOrder: 20, t2RefinedSellOrder: 24, t2BuyOrder: 20,
      t3RefinedBuyOrder: 115, t3RefinedSellOrder: 130,
      stationFee: 7
    },
    thetford: {
      t2RawBuyOrder: 15, t2RawSellOrder: 18,
      t3RawBuyOrder: 38, t3RawSellOrder: 44,
      t2RefinedBuyOrder: 24, t2RefinedSellOrder: 28, t2BuyOrder: 24,
      t3RefinedBuyOrder: 118, t3RefinedSellOrder: 132,
      stationFee: 6
    },
    fort_sterling: {
      t2RawBuyOrder: 14, t2RawSellOrder: 17,
      t3RawBuyOrder: 35, t3RawSellOrder: 41,
      t2RefinedBuyOrder: 23, t2RefinedSellOrder: 27, t2BuyOrder: 23,
      t3RefinedBuyOrder: 114, t3RefinedSellOrder: 128,
      stationFee: 6
    },
    bridgewatch: {
      t2RawBuyOrder: 12, t2RawSellOrder: 15,
      t3RawBuyOrder: 33, t3RawSellOrder: 38,
      t2RefinedBuyOrder: 19, t2RefinedSellOrder: 23, t2BuyOrder: 19,
      t3RefinedBuyOrder: 112, t3RefinedSellOrder: 126,
      stationFee: 6
    },
    caerleon: {
      t2RawBuyOrder: 18, t2RawSellOrder: 22,
      t3RawBuyOrder: 44, t3RawSellOrder: 52,
      t2RefinedBuyOrder: 28, t2RefinedSellOrder: 34, t2BuyOrder: 28,
      t3RefinedBuyOrder: 148, t3RefinedSellOrder: 168,
      stationFee: 12
    }
  },
  wood: {
    martlock: {
      t2RawBuyOrder: 13, t2RawSellOrder: 16,
      t3RawBuyOrder: 36, t3RawSellOrder: 41,
      t2RefinedBuyOrder: 21, t2RefinedSellOrder: 25, t2BuyOrder: 21,
      t3RefinedBuyOrder: 114, t3RefinedSellOrder: 128,
      stationFee: 6
    },
    lymhurst: {
      t2RawBuyOrder: 12, t2RawSellOrder: 15,
      t3RawBuyOrder: 33, t3RawSellOrder: 38,
      t2RefinedBuyOrder: 19, t2RefinedSellOrder: 23, t2BuyOrder: 19,
      t3RefinedBuyOrder: 110, t3RefinedSellOrder: 124,
      stationFee: 6
    },
    thetford: {
      t2RawBuyOrder: 15, t2RawSellOrder: 18,
      t3RawBuyOrder: 37, t3RawSellOrder: 43,
      t2RefinedBuyOrder: 23, t2RefinedSellOrder: 27, t2BuyOrder: 23,
      t3RefinedBuyOrder: 116, t3RefinedSellOrder: 131,
      stationFee: 6
    },
    fort_sterling: {
      t2RawBuyOrder: 14, t2RawSellOrder: 17,
      t3RawBuyOrder: 34, t3RawSellOrder: 39,
      t2RefinedBuyOrder: 22, t2RefinedSellOrder: 26, t2BuyOrder: 22,
      t3RefinedBuyOrder: 108, t3RefinedSellOrder: 122,
      stationFee: 6
    },
    bridgewatch: {
      t2RawBuyOrder: 16, t2RawSellOrder: 19,
      t3RawBuyOrder: 39, t3RawSellOrder: 45,
      t2RefinedBuyOrder: 24, t2RefinedSellOrder: 29, t2BuyOrder: 24,
      t3RefinedBuyOrder: 118, t3RefinedSellOrder: 134,
      stationFee: 7
    },
    caerleon: {
      t2RawBuyOrder: 17, t2RawSellOrder: 21,
      t3RawBuyOrder: 45, t3RawSellOrder: 53,
      t2RefinedBuyOrder: 27, t2RefinedSellOrder: 33, t2BuyOrder: 27,
      t3RefinedBuyOrder: 145, t3RefinedSellOrder: 165,
      stationFee: 12
    }
  },
  cloth: {
    martlock: {
      t2RawBuyOrder: 15, t2RawSellOrder: 18,
      t3RawBuyOrder: 37, t3RawSellOrder: 43,
      t2RefinedBuyOrder: 23, t2RefinedSellOrder: 27, t2BuyOrder: 23,
      t3RefinedBuyOrder: 115, t3RefinedSellOrder: 130,
      stationFee: 6
    },
    lymhurst: {
      t2RawBuyOrder: 13, t2RawSellOrder: 16,
      t3RawBuyOrder: 32, t3RawSellOrder: 37,
      t2RefinedBuyOrder: 20, t2RefinedSellOrder: 24, t2BuyOrder: 20,
      t3RefinedBuyOrder: 108, t3RefinedSellOrder: 121,
      stationFee: 6
    },
    thetford: {
      t2RawBuyOrder: 14, t2RawSellOrder: 17,
      t3RawBuyOrder: 35, t3RawSellOrder: 40,
      t2RefinedBuyOrder: 21, t2RefinedSellOrder: 25, t2BuyOrder: 21,
      t3RefinedBuyOrder: 112, t3RefinedSellOrder: 127,
      stationFee: 6
    },
    fort_sterling: {
      t2RawBuyOrder: 16, t2RawSellOrder: 19,
      t3RawBuyOrder: 38, t3RawSellOrder: 44,
      t2RefinedBuyOrder: 24, t2RefinedSellOrder: 28, t2BuyOrder: 24,
      t3RefinedBuyOrder: 118, t3RefinedSellOrder: 132,
      stationFee: 7
    },
    bridgewatch: {
      t2RawBuyOrder: 14, t2RawSellOrder: 17,
      t3RawBuyOrder: 36, t3RawSellOrder: 42,
      t2RefinedBuyOrder: 22, t2RefinedSellOrder: 26, t2BuyOrder: 22,
      t3RefinedBuyOrder: 114, t3RefinedSellOrder: 129,
      stationFee: 6
    },
    caerleon: {
      t2RawBuyOrder: 19, t2RawSellOrder: 24,
      t3RawBuyOrder: 46, t3RawSellOrder: 54,
      t2RefinedBuyOrder: 29, t2RefinedSellOrder: 35, t2BuyOrder: 29,
      t3RefinedBuyOrder: 150, t3RefinedSellOrder: 172,
      stationFee: 12
    }
  },
  metal: {
    martlock: {
      t2RawBuyOrder: 16, t2RawSellOrder: 19,
      t3RawBuyOrder: 38, t3RawSellOrder: 44,
      t2RefinedBuyOrder: 24, t2RefinedSellOrder: 28, t2BuyOrder: 24,
      t3RefinedBuyOrder: 118, t3RefinedSellOrder: 133,
      stationFee: 6
    },
    lymhurst: {
      t2RawBuyOrder: 15, t2RawSellOrder: 18,
      t3RawBuyOrder: 37, t3RawSellOrder: 43,
      t2RefinedBuyOrder: 23, t2RefinedSellOrder: 27, t2BuyOrder: 23,
      t3RefinedBuyOrder: 116, t3RefinedSellOrder: 131,
      stationFee: 6
    },
    thetford: {
      t2RawBuyOrder: 13, t2RawSellOrder: 16,
      t3RawBuyOrder: 33, t3RawSellOrder: 38,
      t2RefinedBuyOrder: 20, t2RefinedSellOrder: 24, t2BuyOrder: 20,
      t3RefinedBuyOrder: 109, t3RefinedSellOrder: 123,
      stationFee: 6
    },
    fort_sterling: {
      t2RawBuyOrder: 14, t2RawSellOrder: 17,
      t3RawBuyOrder: 35, t3RawSellOrder: 40,
      t2RefinedBuyOrder: 22, t2RefinedSellOrder: 26, t2BuyOrder: 22,
      t3RefinedBuyOrder: 114, t3RefinedSellOrder: 128,
      stationFee: 6
    },
    bridgewatch: {
      t2RawBuyOrder: 14, t2RawSellOrder: 17,
      t3RawBuyOrder: 36, t3RawSellOrder: 42,
      t2RefinedBuyOrder: 21, t2RefinedSellOrder: 25, t2BuyOrder: 21,
      t3RefinedBuyOrder: 115, t3RefinedSellOrder: 129,
      stationFee: 6
    },
    caerleon: {
      t2RawBuyOrder: 18, t2RawSellOrder: 23,
      t3RawBuyOrder: 47, t3RawSellOrder: 55,
      t2RefinedBuyOrder: 28, t2RefinedSellOrder: 34, t2BuyOrder: 28,
      t3RefinedBuyOrder: 149, t3RefinedSellOrder: 170,
      stationFee: 12
    }
  },
  stone: {
    martlock: {
      t2RawBuyOrder: 11, t2RawSellOrder: 14,
      t3RawBuyOrder: 28, t3RawSellOrder: 33,
      t2RefinedBuyOrder: 18, t2RefinedSellOrder: 22, t2BuyOrder: 18,
      t3RefinedBuyOrder: 98, t3RefinedSellOrder: 110,
      stationFee: 6
    },
    lymhurst: {
      t2RawBuyOrder: 14, t2RawSellOrder: 17,
      t3RawBuyOrder: 34, t3RawSellOrder: 40,
      t2RefinedBuyOrder: 22, t2RefinedSellOrder: 26, t2BuyOrder: 22,
      t3RefinedBuyOrder: 106, t3RefinedSellOrder: 120,
      stationFee: 6
    },
    thetford: {
      t2RawBuyOrder: 15, t2RawSellOrder: 18,
      t3RawBuyOrder: 35, t3RawSellOrder: 41,
      t2RefinedBuyOrder: 23, t2RefinedSellOrder: 27, t2BuyOrder: 23,
      t3RefinedBuyOrder: 108, t3RefinedSellOrder: 122,
      stationFee: 6
    },
    fort_sterling: {
      t2RawBuyOrder: 13, t2RawSellOrder: 16,
      t3RawBuyOrder: 33, t3RawSellOrder: 38,
      t2RefinedBuyOrder: 21, t2RefinedSellOrder: 25, t2BuyOrder: 21,
      t3RefinedBuyOrder: 104, t3RefinedSellOrder: 118,
      stationFee: 6
    },
    bridgewatch: {
      t2RawBuyOrder: 10, t2RawSellOrder: 13,
      t3RawBuyOrder: 26, t3RawSellOrder: 30,
      t2RefinedBuyOrder: 17, t2RefinedSellOrder: 21, t2BuyOrder: 17,
      t3RefinedBuyOrder: 92, t3RefinedSellOrder: 104,
      stationFee: 6
    },
    caerleon: {
      t2RawBuyOrder: 16, t2RawSellOrder: 20,
      t3RawBuyOrder: 42, t3RawSellOrder: 50,
      t2RefinedBuyOrder: 26, t2RefinedSellOrder: 32, t2BuyOrder: 26,
      t3RefinedBuyOrder: 136, t3RefinedSellOrder: 155,
      stationFee: 12
    }
  }
};

export const TAX_RATES = {
  PREMIUM: 0.065,    // 6.5% total fee
  NON_PREMIUM: 0.105 // 10.5% total fee
} as const;

export const RRR_PRESETS = {
  CITY_BONUS: 0.40, // 40% city bonus
  DEFAULT: 0.152    // 15.2% default non-bonus royal station
} as const;
