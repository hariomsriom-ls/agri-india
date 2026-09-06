"use client"
import { ReactNode } from "react";
import {FiStar} from "@/components/ui/icons";

function SummaryCard({label,value,note,icon,style,}: {
  label: string;value: string;note: string;icon: ReactNode;style: string;}) {
  return (
    <article className="flex min-h-28 items-center gap-4rounded-2xl border border-slate-200bg-white p-5 shadow-sm ">
      <div className={`} grid h-14 w-14 shrink-0} place-items-center} rounded-xl text-2xl} ${style}`}>
        {icon}
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-600">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-950"> {value} </p>
        <p className="mt-1 text-[11px] text-slate-500"> {note}</p>
      </div>
    </article>
  );
}

function StarRating({rating,}: {
  rating: number;}) {
  return (
    <span className="flex gap-0.5"aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar key={star}
        className={ star <= rating? "fill-amber-400 text-amber-400": "text-slate-300" }/>
      ))}
    </span>
  );
}

function PageButton({children,label,active = false,}: {
  children: ReactNode;label: string;active?: boolean;}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`grid h-9 min-w-9place-items-centerrounded-lg borderpx-2 font-semibold ${
        active ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-500" }`}
    >
      {children}
    </button>
  );
}

export {PageButton, StarRating, SummaryCard}


