import React, { forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      id,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId}`;
    const hasError = !!error;

    const containerClass = `input-container ${fullWidth ? 'input-full-width' : ''}`;
    const wrapperClass = `input-wrapper ${hasError ? 'input-error' : ''} ${
      disabled ? 'input-disabled' : ''
    }`;
    const inputClass = `input ${leftIcon ? 'input-with-left-icon' : ''} ${
      rightIcon || hasError ? 'input-with-right-icon' : ''
    } ${className}`;

    return (
      <div className={containerClass}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
            {required && <span className="input-required">*</span>}
          </label>
        )}

        <div className={wrapperClass}>
          {leftIcon && <span className="input-icon input-icon-left">{leftIcon}</span>}

          <input
            ref={ref}
            id={inputId}
            className={inputClass}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />

          {hasError ? (
            <span className="input-icon input-icon-right input-icon-error">
              <AlertCircle />
            </span>
          ) : (
            rightIcon && <span className="input-icon input-icon-right">{rightIcon}</span>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="input-message input-message-error">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${inputId}-helper`} className="input-message input-message-helper">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
