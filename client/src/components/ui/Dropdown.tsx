"use client";

import { useId, type ChangeEventHandler, type SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export type DropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type DropdownProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children" | "defaultValue" | "multiple" | "value" | "onChange"
> & {
  label: string;
  name: string;
  value: string;
  options: readonly DropdownOption[];
  onChange: ChangeEventHandler<HTMLSelectElement>;
  placeholder?: string;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  preserveValue?: boolean;
};

export default function Dropdown({
  label,
  id,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  loading = false,
  error,
  onRetry,
  preserveValue = false,
  disabled = false,
  className,
  "aria-describedby": describedBy,
  ...selectProps
}: DropdownProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;
  const showSavedValue = preserveValue && value !== "" &&
    !options.some((option) => option.value === value);

  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={selectId}
        className="border-r border-gray-300 px-4 py-3 font-semibold"
      >
        {label}
      </label>
      <select
        {...selectProps}
        id={selectId}
        value={value}
        onChange={onChange}
        disabled={disabled || loading || options.length === 0}
        aria-busy={loading}
        aria-describedby={[describedBy, error ? errorId : undefined].filter(Boolean).join(" ") || undefined}
        className={cn(
          "w-full rounded-xl border border-slate-300 bg-white py-3 pl-4 pr-6 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
          className,
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {showSavedValue && (
          <option value={value} disabled>
            {value}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div className="flex items-center gap-3 text-sm">
          <p id={errorId} role="alert" className="text-red-600">
            {error}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              disabled={loading}
              className="font-medium text-green-700 underline"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}
