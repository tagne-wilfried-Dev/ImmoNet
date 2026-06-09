// src/components/ui/Button.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2',
    'rounded-full border border-transparent',
    'font-body font-medium whitespace-nowrap',
    'transition-all duration-200 ease-out',
    'outline-none select-none',
    'focus-visible:shadow-[0_0_0_3px_rgba(6,182,212,0.20)]',
    'active:scale-[0.98]',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  ].join(' '),
  {
    variants: {
      variant: {
        // DESIGN.md — Primary : gradient cyan
        primary: [
          'bg-gradient-to-br from-[#0891b2] to-[#06b6d4] text-white',
          'shadow-[0_4px_14px_rgba(8,145,178,0.15)]',
          'hover:-translate-y-px hover:from-[#0e7490] hover:to-[#0891b2]',
          'hover:shadow-[0_10px_25px_rgba(8,145,178,0.20)]',
        ].join(' '),

        // DESIGN.md — Secondary : outline cyan
        secondary: [
          'border-[1.5px] border-cyan-600 bg-transparent text-cyan-700',
          'hover:bg-cyan-50',
        ].join(' '),

        // DESIGN.md — Ghost : transparent, texte muted
        ghost: [
          'bg-transparent text-slate-500',
          'hover:bg-slate-100 hover:text-cyan-700',
        ].join(' '),

        // DESIGN.md — Danger : gradient rouge
        danger: [
          'bg-gradient-to-br from-[#dc2626] to-[#ef4444] text-white',
          'shadow-[0_4px_14px_rgba(220,38,38,0.15)]',
          'hover:-translate-y-px hover:shadow-[0_10px_25px_rgba(220,38,38,0.20)]',
        ].join(' '),

        // Icône seule — carré arrondi, fond muted
        icon: [
          'bg-slate-100 text-slate-500 rounded-xl',
          'hover:bg-cyan-50 hover:text-cyan-700',
        ].join(' '),
      },
      size: {
        sm: 'h-8 px-4 text-[13px]',
        md: 'h-10 px-5 text-[14px]',
        lg: 'h-12 px-7 text-[15px]',
        xl: 'h-14 px-9 text-[16px]',
        'icon-sm': 'size-8 rounded-xl',
        'icon-md': 'size-10 rounded-xl',
        'icon-lg': 'size-12 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant = 'primary',
  size = 'md',
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };