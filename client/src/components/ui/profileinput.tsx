"use client"
import { ChangeEvent } from "react";

interface ProfileInputProps {
  label: string;
  name: string;
  value: string;
  type?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileInput({
  label,
  name,
  value,
  type = "text",
  placeholder,
  onChange,
}: ProfileInputProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={name}
        className="px-4 py-3 font-semibold border-r border-gray-300"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="
          w-full rounded-xl border border-slate-300
          bg-white pl-4 pr-6 py-3 text-sm text-slate-900
          outline-none transition
          placeholder:text-slate-400
          focus:border-blue-500 focus:ring-2 focus:ring-blue-100
          disabled:cursor-not-allowed disabled:bg-slate-100
          disabled:text-slate-500
        "
      />
    </div>
  );
}