import React from "react";

const STITCH_TRANSITION = "transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]";

export interface PrimitiveProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function Box({ className = "", children, ...props }: PrimitiveProps) {
  return (
    <div className={`bg-[#0B0C0E] border border-[#1F2226] rounded-xl ${STITCH_TRANSITION} ${className}`} {...props}>
      {children}
    </div>
  );
}

export interface FlexProps extends PrimitiveProps {
  align?: string;
  justify?: string;
  direction?: "row" | "col";
  gap?: string;
}

export function Flex({ className = "", align = "items-center", justify = "justify-between", direction = "row", gap = "gap-4", children, ...props }: FlexProps) {
  return (
    <div className={`flex ${direction === "col" ? "flex-col" : "flex-row"} ${align} ${justify} ${gap} ${STITCH_TRANSITION} ${className}`} {...props}>
      {children}
    </div>
  );
}

export interface StackProps extends PrimitiveProps {
  gap?: string;
}

export function Stack({ className = "", gap = "gap-4", children, ...props }: StackProps) {
  return (
    <div className={`flex flex-col ${gap} ${STITCH_TRANSITION} ${className}`} {...props}>
      {children}
    </div>
  );
}

export interface GridProps extends PrimitiveProps {
  cols?: string;
  gap?: string;
}

export function Grid({ className = "", cols = "grid-cols-12", gap = "gap-6", children, ...props }: GridProps) {
  return (
    <div className={`grid ${cols} ${gap} ${STITCH_TRANSITION} ${className}`} {...props}>
      {children}
    </div>
  );
}
