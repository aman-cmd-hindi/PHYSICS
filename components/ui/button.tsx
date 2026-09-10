import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "accent" | "classroom";
  size?: "sm" | "md" | "lg" | "smartboard" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl active:scale-[0.98]";

    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-input bg-background hover:bg-accent/10 hover:text-accent-foreground",
      ghost: "hover:bg-accent/10 hover:text-accent-foreground",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      accent: "bg-physics-accent text-white hover:bg-physics-accent/90 shadow-sm",
      classroom: "bg-physics-indigo text-white hover:bg-physics-indigo/90 text-lg font-bold shadow-md",
    };

    const sizes = {
      sm: "h-9 px-3 text-xs rounded-lg min-h-[36px]",
      md: "h-11 px-4 text-sm min-h-[44px]", // Touch friendly
      lg: "h-13 px-6 text-base min-h-[52px]",
      smartboard: "h-16 px-8 text-lg min-h-[64px] rounded-2xl tracking-wide", // Smart board optimized
      icon: "h-11 w-11 min-h-[44px] min-w-[44px] p-0 rounded-xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
