import React from 'react';
import './Badge.css';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const baseClass = 'badge';
  const variantClass = `badge-${variant}`;
  const sizeClass = `badge-${size}`;

  const classes = [baseClass, variantClass, sizeClass, className]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
};

export interface BadgeDotProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}

export const BadgeDot: React.FC<BadgeDotProps> = ({
  variant = 'primary',
  className = '',
}) => {
  const baseClass = 'badge-dot';
  const variantClass = `badge-dot-${variant}`;

  const classes = [baseClass, variantClass, className].filter(Boolean).join(' ');

  return <span className={classes} />;
};
