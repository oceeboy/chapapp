"use client";

import { Eye, EyeClosed } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

interface FormFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  placeholder?: string;
  label?: string;
  rules?: Partial<{
    required: string | boolean;
    maxLength: number;
    minLength: number;
  }>;
  multiline?: boolean;
  errorMessage?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  textParseInt?: boolean;
  dateBox?: boolean;
  disabled?: boolean;
}

export function FormField<TFieldValues extends FieldValues>({
  control,
  name,
  placeholder,
  label,
  rules,
  multiline = false,
  errorMessage,
  required = false,
  secureTextEntry = false,
  textParseInt = false,
  dateBox = false,
  disabled = false,
}: FormFieldProps<TFieldValues>): React.ReactElement {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [height, setHeight] = useState(48);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const resizeTextarea = () => {
        textareaRef.current!.style.height = "auto";
        textareaRef.current!.style.height = `${
          textareaRef.current!.scrollHeight
        }px`;
      };

      resizeTextarea();
    }
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        ...rules,
        ...(required && { required: "This field is required" }),
      }}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <div className="w-full mb-4">
          {label && (
            <div className="mb-2">
              <label className="font-bold text-base text-gray-800">
                {label}
                {required && <span className="text-red-600 ml-1">*</span>}
              </label>
            </div>
          )}

          <div
            className={`flex items-center border border-gray-300 rounded-md px-3 py-2 min-h-[48px] ${
              disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : ""
            }`}
          >
            {multiline ? (
              <textarea
                ref={textareaRef}
                className="flex-1 border-none outline-none text-base font-sans resize-none transition-all bg-transparent"
                placeholder={placeholder}
                value={value || ""}
                onChange={(e) => {
                  onChange(e.target.value);
                  setHeight(e.target.scrollHeight);
                }}
                onBlur={onBlur}
                style={{ height }}
                rows={3}
                disabled={disabled}
                aria-label={label || placeholder}
                aria-required={required}
              />
            ) : (
              <input
                className="flex-1 border-none outline-none text-base font-sans bg-transparent"
                type={
                  secureTextEntry
                    ? isPasswordVisible
                      ? "text"
                      : "password"
                    : textParseInt
                    ? "number"
                    : dateBox
                    ? "date"
                    : "text"
                }
                placeholder={placeholder}
                value={value || ""}
                onChange={(e) =>
                  onChange(
                    textParseInt
                      ? parseInt(e.target.value || "0", 10)
                      : e.target.value
                  )
                }
                onBlur={onBlur}
                disabled={disabled}
                aria-label={label || placeholder}
                aria-required={required}
              />
            )}

            {secureTextEntry && (
              <button
                type="button"
                onClick={() => setPasswordVisible(!isPasswordVisible)}
                className="ml-2 bg-transparent border-none cursor-pointer"
                disabled={disabled}
              >
                {isPasswordVisible ? (
                  <Eye width={20} height={20} />
                ) : (
                  <EyeClosed width={20} height={20} />
                )}
              </button>
            )}
          </div>

          {(error || errorMessage) && (
            <p className="text-red-600 text-sm mt-2">
              {error?.message || errorMessage || "Invalid input"}
            </p>
          )}
        </div>
      )}
    />
  );
}
