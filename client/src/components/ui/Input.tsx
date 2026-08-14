"use client";
import { ChangeEvent } from "react";

interface InputFieldProps {
  label: string;
  labelclassName?: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
 value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

export function InputField({
  label,
  labelclassName,
  name,
  type = "text",
  required = false,
  placeholder = "",
  className,
 value,
  onChange,
  readOnly
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label
        htmlFor={name}
        className={`text-base font-semibold text-gray-900 ${labelclassName}`}
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-gray-300 px-2 py-2 hover:bg-gray-100
                   outline-none transition 
                   focus:border-green-600 focus:bg-gray-200
                   focus:ring-1 focus:ring-green-200 ${className}`}
       value={value}
        onChange={onChange}
         readOnly={readOnly}
      />
    </div>
  );
}