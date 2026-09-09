"use client"
import { ReactNode } from "react";
import {FiStar} from "@/components/ui/icons";

function SummaryCard({label,value,note,icon,style,}: {
  label: string;value: string;note: string;icon: ReactNode;style: string;}) {
  return (
    <article className="flex min-h-28 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ">
      <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl text-2xl ${style}`}>
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

function PageButton({
  children,
  label,
  active = false,
  disabled = false,
  onClick,
}: {
  children: ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      className={`grid h-9 min-w-9 place-items-center rounded-lg border px-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${active ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500"}`}
    >
      {children}
    </button>
  );
}

function QuickAction({ icon, title, text, style }:
  { icon: React.ReactNode; title: string; text: string; style: string }) {
  return (
  <button type="button" className="flex w-full items-center gap-3 text-left">
    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-xl ${style}`}>
      {icon}</span>
    <span>
      <strong className="block text-xs text-slate-800">
      {title}
      </strong>
    <small className="mt-1 block text-[10px] text-slate-500">
      {text}
      </small>
      </span>
      </button>
  )
}

function Category({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (<div className="flex items-start gap-3">
    <span className="mt-0.5 text-base text-violet-600">
      {icon}
      </span>
      <div>
        <h3 className="text-xs font-bold text-slate-800">{title}</h3>
        <p className="mt-1 text-[10px] leading-4 text-slate-500">{text}</p>
        </div>
        </div>
  )
}


export {PageButton, StarRating, SummaryCard, QuickAction, Category}
