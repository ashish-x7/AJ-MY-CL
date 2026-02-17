
import React from 'react';
import { PricingResult, Marketplace } from '../types';
import { GST_RATE } from '../constants';

interface ResultCardProps {
  result: PricingResult;
  baseTp: number;
  targetSettlement: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, baseTp, targetSettlement }) => {
  const format = (val: number, decimals: number = 2) => 
    `₹${val.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;

  const marketplaceCosts = (result.commission || 0) + ((result.fixedFee || 0) * (1 + GST_RATE)) + ((result.reverseLogisticsFee || 0) * (1 + GST_RATE)) + (result.tcs || 0) + (result.tds || 0);
  const markupAmount = targetSettlement - baseTp;

  if (result.marketplace === Marketplace.AJIO) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-forest-accent shadow-xl ring-1 ring-inset ring-white/60 space-y-6 dark:bg-forest-pine/40 dark:border-forest-leaf/30 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-forest-leaf/5 blur-3xl pointer-events-none"></div>
        <div className="flex items-center justify-between border-b border-forest-accent pb-4 dark:border-forest-leaf/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-forest-accent/30 rounded-full flex items-center justify-center text-forest-leaf dark:bg-forest-leaf/20 dark:text-forest-sage">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <h3 className="text-sm font-black text-forest-pine uppercase tracking-tight dark:text-forest-mint">AJIO Analysis</h3>
          </div>
          <div className="px-3 py-1 bg-forest-pine text-white text-[8px] font-black uppercase rounded-full dark:bg-forest-leaf">Live Node</div>
        </div>

        <div className="space-y-1.5">
          <AjioRow label="AVG MRP" value={format(result.mrp || 0)} />
          <AjioRow label={`Trade (${result.tradeDiscountPercent}%)`} value={`${result.tradeDiscountPercent}%`} />
          <AjioRow label="ASP (Gross)" value={format(result.aspGross || 0)} isBold />
          <AjioRow label="Net Sales" value={format(result.netSalesValue || 0)} />
          <AjioRow label={`Margin (${result.commissionRate}%)`} value={format(result.commission)} />
          <AjioRow label="Purchase price" value={format(result.purchasePrice || 0)} isBold />
          
          <div className="mt-4 bg-forest-pine p-5 rounded-2xl text-white flex justify-between items-center shadow-lg relative overflow-hidden dark:bg-forest-leaf/40">
             <div className="relative z-10 flex flex-col">
                <span className="text-[8px] font-black text-forest-accent/60 uppercase tracking-[0.2em] mb-1">Bank Settlement</span>
                <span className="text-3xl font-black tracking-tighter italic">{format(result.totalActualSettlement)}</span>
             </div>
             <div className="relative z-10 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" /></svg>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-forest-mint p-4 rounded-xl border border-forest-accent flex flex-col items-center text-center dark:bg-forest-pine/60 dark:border-forest-leaf/30">
               <span className="text-[7px] font-black text-forest-leaf/50 uppercase tracking-widest mb-1">Net Profit</span>
               <span className={`text-lg font-black ${result.totalActualSettlement - baseTp >= 0 ? 'text-forest-leaf dark:text-forest-sage' : 'text-rose-600'}`}>
                 {format(result.totalActualSettlement - baseTp)}
               </span>
            </div>
            <div className="bg-forest-mint p-4 rounded-xl border border-forest-accent flex flex-col items-center text-center dark:bg-forest-pine/60 dark:border-forest-leaf/30">
               <span className="text-[7px] font-black text-forest-leaf/50 uppercase tracking-widest mb-1">ROI</span>
               <span className={`text-lg font-black ${result.totalActualSettlement - baseTp >= 0 ? 'text-forest-leaf dark:text-forest-sage' : 'text-rose-600'}`}>
                 {((result.totalActualSettlement - baseTp) / baseTp * 100).toFixed(2)}%
               </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-forest-pine p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden dark:bg-forest-leaf/80 ring-1 ring-white/10">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
        <div className="relative z-10 space-y-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-forest-accent">Selling Price (AISP)</span>
            </div>
            {result.brand && (
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/40">
                {result.brand} • {result.articleType}
              </span>
            )}
          </div>
          
          <h3 className="text-6xl font-black tracking-tighter leading-none italic drop-shadow-xl">
            {format(result.aisp)}
          </h3>
          
          <div className="flex justify-center gap-10 pt-6 border-t border-white/10">
            <div className="flex flex-col items-center">
              <span className="text-forest-accent/30 uppercase text-[7px] font-black tracking-[0.2em] mb-1">Consumer Price</span>
              <span className="text-2xl font-black tracking-tight">{format(result.customerPrice)}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-forest-accent/30 uppercase text-[7px] font-black tracking-[0.2em] mb-1">Logistics Cost</span>
              <span className="text-2xl font-black tracking-tight text-forest-sage">{format(result.logisticsFee)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-forest-accent shadow-md space-y-4 dark:bg-forest-pine/40 dark:border-forest-leaf/30">
          <h4 className="text-[9px] font-black text-forest-leaf uppercase tracking-[0.2em] flex items-center gap-2 dark:text-forest-sage">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> Platform Deductions
          </h4>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-forest-pine/40 uppercase tracking-wider">Commission % (Inc. GST)</span>
              <span className="font-black text-sm text-forest-pine dark:text-forest-mint">{result.commissionRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-forest-pine/40 uppercase tracking-wider">Commission Amt (Inc. GST)</span>
              <span className="font-black text-sm text-forest-pine dark:text-forest-mint">{format(result.commission)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-forest-pine/40 uppercase tracking-wider">Fixed Fee & GST</span>
              <span className="font-black text-sm text-forest-pine dark:text-forest-mint">{format(result.fixedFee * (1 + GST_RATE))}</span>
            </div>
            <div className="pt-3 border-t border-forest-accent flex justify-between items-center dark:border-forest-leaf/20">
              <span className="text-[9px] font-black text-forest-pine uppercase tracking-widest dark:text-forest-mint">Total Leakage</span>
              <span className="font-black text-rose-600 text-lg">-{format(marketplaceCosts)}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-forest-accent shadow-md space-y-4 dark:bg-forest-pine/40 dark:border-forest-leaf/30">
          <h4 className="text-[9px] font-black text-forest-leaf uppercase tracking-[0.2em] flex items-center gap-2 dark:text-forest-sage">
            <span className="w-1.5 h-1.5 bg-forest-leaf rounded-full"></span> Value Allocation
          </h4>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-forest-pine/40 uppercase tracking-wider">Transfer Cost</span>
              <span className="font-black text-sm text-forest-pine dark:text-forest-mint">{format(baseTp)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-forest-pine/40 uppercase tracking-wider">Business Markup</span>
              <span className="font-black text-sm text-forest-leaf dark:text-forest-sage">+{format(markupAmount)}</span>
            </div>
            <div className="pt-3 border-t border-forest-accent flex justify-between items-center dark:border-forest-leaf/20">
              <span className="text-[9px] font-black text-forest-pine uppercase tracking-widest dark:text-forest-mint">Net Goal</span>
              <span className="font-black text-forest-pine text-lg dark:text-forest-mint">{format(targetSettlement)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-forest-leaf rounded-[2.5rem] p-8 flex justify-between items-center shadow-xl dark:bg-forest-pine/60 dark:border-forest-sage relative overflow-hidden group/final">
        <div className="flex flex-col relative z-10">
          <span className="text-[9px] font-black text-forest-leaf uppercase mb-1 tracking-[0.3em] dark:text-forest-sage">Settlement Payout</span>
          <span className="text-5xl font-black text-forest-pine tracking-tighter italic dark:text-forest-mint">
            {format(result.totalActualSettlement)}
          </span>
        </div>
        <div className="w-14 h-14 bg-forest-leaf text-white flex items-center justify-center rounded-2xl shadow-lg dark:bg-forest-sage relative z-10">
           <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
        </div>
      </div>
    </div>
  );
};

const AjioRow: React.FC<{ label: string; value: string; isBold?: boolean }> = ({ label, value, isBold }) => (
  <div className={`flex justify-between items-center px-4 py-2 rounded-lg transition-all ${isBold ? 'bg-forest-accent/30 dark:bg-forest-leaf/20' : 'hover:bg-forest-mint dark:hover:bg-forest-pine/60'}`}>
    <span className={`text-[8px] uppercase font-black tracking-widest ${isBold ? 'text-forest-pine dark:text-forest-mint' : 'text-forest-pine/40 dark:text-forest-sage/40'}`}>{label}</span>
    <span className={`text-sm font-black tracking-tight text-forest-pine dark:text-forest-mint`}>{value}</span>
  </div>
);

export default ResultCard;
