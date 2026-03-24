import React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface GlowButtonProps extends React.ComponentProps<typeof Button> {
  glowColor?: "green" | "red" | "cyan" | "purple" | "default";
}

export const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, glowColor = "green", ...props }, ref) => {
    
    const glowClasses = {
      default: "hover:border-foreground hover:shadow-[0_0_10px_rgba(255,255,255,0.2)_inset,0_0_10px_rgba(255,255,255,0.2)] text-foreground",
      green: "hover:border-neon-green hover:shadow-[0_0_10px_rgba(0,255,0,0.5)_inset,0_0_10px_rgba(0,255,0,0.5)] text-foreground hover:text-neon-green",
      red: "hover:border-neon-red hover:shadow-[0_0_10px_rgba(255,0,60,0.5)_inset,0_0_10px_rgba(255,0,60,0.5)] text-foreground hover:text-neon-red",
      cyan: "hover:border-neon-cyan hover:shadow-[0_0_10px_rgba(0,255,255,0.5)_inset,0_0_10px_rgba(0,255,255,0.5)] text-foreground hover:text-neon-cyan",
      purple: "hover:border-neon-purple hover:shadow-[0_0_10px_rgba(176,38,255,0.5)_inset,0_0_10px_rgba(176,38,255,0.5)] text-foreground hover:text-neon-purple"
    };

    return (
      <Button
        ref={ref}
        variant="outline"
        className={cn(
          "bg-transparent border-border rounded-sm transition-all duration-300",
          glowClasses[glowColor],
          className
        )}
        {...props}
      />
    );
  }
);
GlowButton.displayName = "GlowButton";
