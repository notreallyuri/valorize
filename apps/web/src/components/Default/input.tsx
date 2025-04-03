"use client";
import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
  error?: string;
  required?: boolean;
  type?: "text" | "password" | "number" | "date" | "email" | "phone";
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      type = "text",
      className,
      error,
      showPasswordToggle = false,
      required = false,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    function handleTogglePassword(e: React.MouseEvent<HTMLButtonElement>) {
      e.preventDefault();
      setShowPassword(prev => !prev);
    }

    const inputType =
      type === "password" ? (showPassword ? "text" : "password") : type;

    return (
      <div className="relative flex flex-col">
        <label htmlFor={id} className={cn(error && "text-red-600")}>
          {label}
        </label>
        <input
          id={id}
          type={inputType}
          className={cn(
            "h-11 min-h-10 min-w-40 rounded-xl border px-2 outline-none",
            "border-gray-300 bg-gray-100",
            error && "border-error-600",
          )}
          ref={ref}
          {...props}
        />

        {showPasswordToggle && (
          <button
            onClick={handleTogglePassword}
            className={cn(
              "absolute top-1/2 right-4 flex size-6 items-center justify-center",
              "text-lg",
            )}
          >
            {showPassword ? (
              <Eye className="text-gray-500" />
            ) : (
              <EyeOff className="text-gray-500" />
            )}
          </button>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
