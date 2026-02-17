
import React from 'react';
import { Level, Region, ReverseLogisticsMode, ArticleType, BusinessBuffers, Marketplace, Brand } from '../types';
import { ARTICLE_SPECIFICATIONS } from '../constants';

interface CalculatorFormProps {
  marketplace: Marketplace;
  setMarketplace: (val: Marketplace) => void;
  brand: Brand;
  setBrand: (val: Brand) => void;
  articleType: ArticleType;
  setArticleType: (val: ArticleType) => void;
  tpPrice: number;
  setTpPrice: (val: number) => void;
  targetSettlement: number;
  setTargetSettlement: (val: number) => void;
  level: Level;
  setLevel: (val: Level) => void;
  isReverse: boolean;
  setIsReverse: (val: boolean) => void;
  reverseRegion: Region;
  setReverseRegion: (val: Region) => void;
  reverseMode: ReverseLogisticsMode;
  setReverseMode: (val: ReverseLogisticsMode) => void;
  reversePercent: number;
  setReversePercent: (val: number) => void;
  buffers: BusinessBuffers;
  setBuffers: (val: BusinessBuffers) => void;
  ajioTradeDiscount: number;
  setAjioTradeDiscount: (val: number) => void;
  ajioMargin: number;
  setAjioMargin: (val: number) => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({
  marketplace,
  setMarketplace,
  brand,
  setBrand,
  articleType,
  setArticleType,
  tpPrice,
  setTpPrice,
  targetSettlement,
  level,
  setLevel,
  buffers,
  setBuffers,
  ajioTradeDiscount,
  setAjioTradeDiscount,
  ajioMargin,
  setAjioMargin
}) => {
  const handleArticleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as ArticleType;
    setArticleType(newType);
    const spec = ARTICLE_SPECIFICATIONS[newType];
    if (spec) setLevel(spec.defaultLevel);
  };

  const updateBuffer = (key: keyof BusinessBuffers, val: number) => {
    setBuffers({ ...buffers, [key]: val });
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-forest-accent shadow-xl ring-1 ring-inset ring-white/60 space-y-6 dark:bg-forest-pine/40 dark:border-forest-leaf/30 relative overflow-hidden group">
      <div className="relative z-10 flex items-center justify-between border-b border-forest-accent/50 pb-4 dark:border-forest-leaf/20">
        <h2 className="text-[10px] font-black text-forest-pine uppercase tracking-[0.2em] dark:text-forest-mint">Configuration</h2>
        <div className="flex bg-forest-accent/30 p-1 rounded-lg shadow-inner dark:bg-forest-leaf/20">
          {[Marketplace.MYNTRA, Marketplace.AJIO].map(m => (
            <button 
              key={m}
              onClick={() => setMarketplace(m)}
              className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-md transition-all ${marketplace === m ? 'bg-forest-pine text-white shadow-md dark:bg-forest-leaf' : 'text-forest-pine/40 hover:text-forest-pine dark:text-forest-sage/60'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {marketplace === Marketplace.MYNTRA && (
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-forest-leaf uppercase tracking-widest block dark:text-forest-sage">Partner Brand</label>
              <div className="relative">
                <select 
                  value={brand}
                  onChange={(e) => setBrand(e.target.value as Brand)}
                  className="w-full pl-3 pr-8 py-2.5 bg-white border border-forest-accent rounded-xl font-bold text-sm text-gray-900 outline-none focus:border-forest-leaf transition-all appearance-none cursor-pointer dark:bg-white dark:border-forest-leaf/40 dark:text-gray-900 shadow-sm"
                >
                  {Object.values(Brand).map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-forest-leaf opacity-40">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          )}

          <div className={`space-y-1.5 ${marketplace !== Marketplace.MYNTRA ? 'col-span-2' : ''}`}>
            <label className="text-[9px] font-black text-forest-leaf uppercase tracking-widest block dark:text-forest-sage">Article Type</label>
            <div className="relative">
              <select 
                value={articleType}
                onChange={handleArticleChange}
                disabled={marketplace === Marketplace.AJIO}
                className="w-full pl-3 pr-8 py-2.5 bg-white border border-forest-accent rounded-xl font-bold text-sm text-gray-900 outline-none focus:border-forest-leaf transition-all appearance-none cursor-pointer disabled:opacity-40 dark:bg-white dark:border-forest-leaf/40 dark:text-gray-900 shadow-sm"
              >
                {Object.values(ArticleType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-forest-leaf opacity-40">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>

        {marketplace === Marketplace.AJIO && (
          <div className="grid grid-cols-2 gap-4 bg-forest-accent/10 p-4 rounded-2xl border border-forest-accent/50 dark:bg-forest-leaf/5 shadow-inner">
             <div className="space-y-1">
              <label className="text-[8px] font-black text-forest-leaf uppercase block dark:text-forest-sage opacity-60">Trade %</label>
              <input
                type="number"
                value={ajioTradeDiscount}
                onChange={(e) => setAjioTradeDiscount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-forest-accent rounded-lg font-black text-sm text-forest-pine outline-none focus:border-forest-leaf transition-all dark:bg-forest-pine/60 dark:text-forest-mint shadow-inner"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-forest-leaf uppercase block dark:text-forest-sage opacity-60">Margin %</label>
              <input
                type="number"
                value={ajioMargin}
                onChange={(e) => setAjioMargin(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-forest-accent rounded-lg font-black text-sm text-forest-pine outline-none focus:border-forest-leaf transition-all dark:bg-forest-pine/60 dark:text-forest-mint shadow-inner"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[9px] font-black text-forest-leaf uppercase tracking-[0.2em] block dark:text-forest-sage">Manufacturing Cost (TP)</label>
          <div className="relative group/input">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-pine font-black text-2xl opacity-20 dark:text-forest-mint">₹</span>
            <input
              type="number"
              value={tpPrice || ''}
              onChange={(e) => setTpPrice(Number(e.target.value))}
              className="w-full pl-10 pr-6 py-4 bg-white border-2 border-forest-accent rounded-2xl font-black text-3xl text-forest-pine outline-none focus:border-forest-leaf focus:ring-4 focus:ring-forest-leaf/5 transition-all shadow-inner dark:bg-forest-pine/60 dark:border-forest-leaf/40 dark:text-forest-mint"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="p-5 bg-forest-accent/20 rounded-2xl border border-forest-accent/50 space-y-4 backdrop-blur-md shadow-inner dark:bg-forest-leaf/10 dark:border-forest-leaf/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-forest-leaf rounded-full shadow-[0_0_8px_rgba(45,90,58,0.4)]"></span>
            <h3 className="text-[9px] font-black text-forest-leaf uppercase tracking-widest dark:text-forest-sage">Margin Buffers</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(buffers).map((key) => (
              <div key={key} className="space-y-1">
                <label className="text-[8px] font-black text-forest-leaf/40 uppercase dark:text-forest-sage/40">{key.replace('Percent','').replace('Margin',' MARGIN')}</label>
                <div className="relative">
                   <input 
                    type="number" 
                    value={(buffers as any)[key]} 
                    onChange={(e) => updateBuffer(key as keyof BusinessBuffers, Number(e.target.value))} 
                    className="w-full px-3 py-2 bg-white border border-forest-accent rounded-lg font-black text-sm text-forest-pine outline-none focus:border-forest-leaf shadow-sm dark:bg-forest-pine/60 dark:border-forest-leaf/40 dark:text-forest-mint" 
                  />
                   <span className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-leaf/20 font-black text-[10px]">%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-forest-pine p-5 rounded-2xl flex justify-between items-center shadow-lg border border-white/10 dark:bg-forest-leaf">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-forest-accent/40 uppercase tracking-[0.2em] mb-1">Target Payout</span>
            <span className="text-2xl font-black text-white tracking-tighter leading-none italic">₹{targetSettlement.toLocaleString()}</span>
          </div>
          <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 backdrop-blur-xl">
             <span className="text-[8px] font-black text-forest-accent uppercase tracking-[0.1em]">Goal</span>
          </div>
        </div>

        {marketplace === Marketplace.MYNTRA && (
          <div className="space-y-3 pt-2 border-t border-forest-accent/30 dark:border-forest-leaf/20">
            <label className="text-[9px] font-black text-forest-leaf uppercase block tracking-[0.1em] dark:text-forest-sage">Logistics Tier</label>
            <div className="grid grid-cols-5 gap-2">
              {Object.values(Level).map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`py-2 text-[10px] font-black rounded-lg transition-all border ${
                    level === l ? 'bg-forest-leaf text-white border-forest-leaf shadow-md dark:bg-forest-sage dark:border-forest-sage' : 'bg-white text-forest-pine/40 border-forest-accent hover:border-forest-leaf dark:bg-forest-pine/40 dark:border-forest-leaf/20'
                  }`}
                >
                  {l.replace('Level ', 'L')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculatorForm;
