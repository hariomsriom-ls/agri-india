"use client";
import{useMemo} from "react"
import type { PaymentStatus } from "@/features/landowner-Worker/paymenthistory";

function MiniTrend({ color }: { color: string }) {
  return (<svg viewBox="0 0 70 42" className={`ml-auto hidden w-14 shrink-0 sm:block ${color}`} aria-hidden="true">
    <path d="M2 37 13 29 22 32 34 17 44 20 54 8 67 2" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 37 13 29 22 32 34 17 44 20 54 8 67 2V42H2Z" fill="currentColor" opacity=".08" />
    </svg>);
}

const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec",];
const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0,}).format(value);
const compactNumber = (value: number) => new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1, }).format(value);

type ChartPayment = {amount: number; paymentdate: string | Date; paymentStatus: PaymentStatus};

function EarningsChart({payments,
    year = new Date(). getFullYear(),
}:{payments: ChartPayment[];
    year?: number;
}) {
  const width = 1100;
  const height = 245;
  const left = 48;
  const right = 20;
  const top = 28;
  const bottom = 35;
  const plotHeight = height - top - bottom;
  const step = (width - left - right) / 12;
  const monthly = useMemo(() => {
const totals = Array<number>(12).fill(0);

    payments.forEach((payment)=>{
        if(payment.paymentStatus !== "Completed"){
            return;
        }
        const paymentdate = new Date(payment.paymentdate);

        if (Number.isNaN(paymentdate.getTime()) ||paymentdate.getFullYear() !== year) {
        return;
        }
    const monthIndex = paymentdate.getMonth();
      totals[monthIndex] += Number(payment.amount) || 0;
        });
         return totals;
  }, [payments, year]);


  const cumulative = useMemo(() => {
    return monthly.reduce<number[]>((totals, amount) => {
      const previousTotal = totals[totals.length - 1] ?? 0;
      return [...totals, previousTotal + amount];
    }, []);
  }, [monthly]);

   const maximumMonthly = Math.max(...monthly, 1);
  const maximumCumulative = Math.max(...cumulative, 1);

  const points = cumulative.map((value, index) => {
    const x = left + step * index +step / 2;
    const y = top + plotHeight - (value / maximumCumulative) * plotHeight;
    return `${x},${y}`;
  }).join(" ");

const hasEarnings = monthly.some((value) => value > 0);

  if (!hasEarnings) {
    return (
      <p className="mt-5 py-12 text-center text-slate-500">
        No paid earnings found for {year}.
      </p>
    );
  }
  return (
    <div className="mt-5 overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} 
      className="h-[260px] min-w-[900px] w-full" role="img" aria-label="Monthly and cumulative earnings chart">
        {cumulative.map((value) => {
          const y = top + plotHeight - (value / maximumMonthly) * plotHeight;
          return (
          <g key={value}>
            <line x1={left} y1={y} 
            x2={width - right} y2={y} 
            stroke="#e2e8f0" strokeDasharray="3 4" />
          <text x={left - 10} y={y + 4} textAnchor="end" fontSize="10" fill="#64748b">
            {value === 0 ? "0" : compactNumber(value)}
          </text>
          </g>);
        })}

        {monthly.map((value, index) => {
          const barHeight = (value / maximumMonthly) * plotHeight;
          const x = left + step * index + step * 0.23;
          return (<g key={months[index]}>
            <rect x={x} y={top + plotHeight - barHeight} 
            width={step * 0.54} height={barHeight} rx="5" fill="#8bd9a6" opacity=".9" />
            <text x={x + step * 0.27} y={top + plotHeight - barHeight - 7} textAnchor="middle" fontSize="9" fill="#475569">
                {money(value).slice(1)}
            </text>
            <text x={x + step * 0.27} y={height - 10} textAnchor="middle" fontSize="10" fontWeight="600" fill="#475569">
                {months[index]}
            </text></g>);
        })}

        <polyline points={points} fill="none" 
        stroke="#08783f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {cumulative.map((value, index) => {
          const x = left + step * index + step / 2;
          const y = top + plotHeight - (value / maximumCumulative) * plotHeight;
          return (
          <g key={months[index]}>
            <circle cx={x} cy={y} r="4" fill="#08783f" stroke="white" strokeWidth="2" />
            <text x={x} y={y - 10} textAnchor="middle" fontSize="9" fontWeight="600" fill="#334155">
                {compactNumber(value)}
            </text>
        </g>);
        })}
      </svg>
    </div>
  );
}

export{MiniTrend, EarningsChart}
