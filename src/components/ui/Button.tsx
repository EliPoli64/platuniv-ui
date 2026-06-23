import type { ReactNode, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'danger' | 'success' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  loading?: boolean;
  children?: ReactNode;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  danger: 'btn-danger',
  success: 'btn-success',
  outline: 'btn-outline',
  ghost: 'btn bg-transparent text-primary border-none hover:bg-bg',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: '',
  lg: 'px-6 py-3 text-base',
};

const spinnerClass: Record<ButtonVariant, string> = {
  primary: 'border-white/30 border-t-white',
  danger: 'border-white/30 border-t-white',
  success: 'border-white/30 border-t-white',
  outline: 'border-primary/30 border-t-primary',
  ghost: 'border-primary/30 border-t-primary',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const classes = [
    variantClass[variant],
    sizeClass[size],
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? (
        <div className={`w-4 h-4 border-2 rounded-full animate-spin shrink-0 ${spinnerClass[variant]}`} />
      ) : Icon ? (
        <Icon size={16} className="shrink-0" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
}
