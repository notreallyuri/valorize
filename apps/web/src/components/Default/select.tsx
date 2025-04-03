"use client";
import React, { useState, useRef, useEffect } from "react";
import { type Control, type FieldValues, useController } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils";

interface SelectOptions {
  label: string;
  value: string;
}

export interface SelectProps<T extends FieldValues = FieldValues> {
  label: string;
  options: SelectOptions[];
  placeholder?: string;
  name: string;
  control?: Control<T>;
  defaultValue?: string | null;
  className?: string;
  error?: string;
}

export function Select({
  label,
  options,
  placeholder = "Select an option",
  name,
  control,
  defaultValue = null,
  className,
  error,
}: SelectProps) {
  const { field } = useController({ name, control, defaultValue });
  const selectRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (selectRef.current && e.target instanceof Node) {
        if (!selectRef.current.contains(e.target)) setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function selectOption(option: SelectOptions) {
    field.onChange(option.value);
    setIsOpen(false);
  }

  function getButtonText() {
    const selected = options.find((option) => option.value === field.value);
    return selected ? selected.label : placeholder;
  }

  useEffect(() => {
    console.log(`Select ${name} value:`, field.value);
  }, [field.value, name]);

  return (
    <div className={cn("relative w-full", className)} ref={selectRef}>
      <label>{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-11 w-full items-center justify-between px-4 text-left",
          "border border-gray-300 bg-gray-100 hover:border-gray-200",
          "rounded-xl outline-none focus:border-indigo-500",
          error && "border-error-400",
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{getButtonText()}</span>
        <span className="pointer-events-none ml-2">
          <ChevronDown />
        </span>
      </button>

      {isOpen && (
        <div
          className={cn(
            "rounded-mg absolute z-10 mt-1 w-full overflow-auto border",
            "max-h-60 rounded-lg bg-white shadow-lg",
          )}
        >
          <ul className="py-1">
            {options.map((option) => {
              const isSelected = field.value === option.value;
              return (
                <li
                  key={option.value}
                  onClick={() => selectOption(option)}
                  className={cn(
                    "flex cursor-pointer items-center px-3 py-2 hover:bg-blue-100/20",
                    isSelected && "bg-blue-50/20",
                  )}
                >
                  <span className="ml-2">{option.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {error && <p className="text-error-400 mt-1 text-sm">{error}</p>}
    </div>
  );
}

export interface MultiSelectProps<T extends FieldValues = FieldValues> {
  label: string;
  options: SelectOptions[];
  placeholder?: string;
  name: string;
  control?: Control<T>;
  defaultValue?: SelectOptions[];
  className?: string;
  error?: string;
}

export function MultiSelect({
  label,
  options,
  placeholder = "Select options",
  name,
  control,
  defaultValue = [],
  className,
  error,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);

  const { field } = useController({
    name,
    control,
    defaultValue: defaultValue || [],
  });

  useEffect(() => {
    if (!Array.isArray(field.value)) {
      field.onChange([]);
    }
  }, [field]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (selectRef.current && e.target instanceof Node) {
        if (!selectRef.current.contains(e.target)) setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function toggleOption(option: SelectOptions) {
    const currentValue = Array.isArray(field.value) ? field.value : [];

    const selected = currentValue.some(
      (item: SelectOptions) => item.value === option.value,
    );

    const newSelection = selected
      ? currentValue.filter(
          (item: SelectOptions) => item.value !== option.value,
        )
      : [...currentValue, option];

    field.onChange(newSelection);
  }

  function getButtonText() {
    if (
      !field.value ||
      !Array.isArray(field.value) ||
      field.value.length === 0
    ) {
      return placeholder;
    } else if (field.value.length === 1) {
      return field.value[0].label;
    } else {
      return `${field.value.length} options selected`;
    }
  }

  return (
    <div className={cn("relative w-full", className)} ref={selectRef}>
      <label>{label}</label>
      <button
        className={cn(
          "flex w-full items-center justify-between px-4 py-2 text-left",
          "border border-zinc-300 bg-gray-100 hover:border-zinc-200",
          "rounded-xl outline-none focus:border-blue-400/40",
          error && "border-error-400",
        )}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        // Don't spread field props on button
        ref={field.ref}
      >
        <span>{getButtonText()}</span>
        <span className="pointer-events-none ml-2">
          <ChevronDown />
        </span>
      </button>
      {isOpen && (
        <div
          className={cn(
            "rounded-mg absolute z-10 mt-1 w-full overflow-auto border",
            "max-h-60 rounded-lg border-zinc-200 bg-white shadow-lg",
          )}
        >
          <ul className="py-1">
            {options.map((option) => {
              const isSelected =
                Array.isArray(field.value) &&
                field.value.some(
                  (item: SelectOptions) => item.value === option.value,
                );
              return (
                <li
                  key={option.value}
                  onClick={() => toggleOption(option)}
                  className={`flex cursor-pointer items-center px-3 py-2 hover:bg-blue-100/20 ${isSelected ? "bg-blue-50/20" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="h-4 w-4 accent-indigo-600"
                    readOnly
                  />
                  <span className="ml-2">{option.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {error && <p className="text-error-400 mt-1 text-sm">{error}</p>}
    </div>
  );
}
