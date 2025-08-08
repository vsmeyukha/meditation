"use client";

import { ReactNode, MouseEvent } from "react";
import { useNavigationTransition } from "@/shared/contexts/NavigationTransitionContext";

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}

export function TransitionLink({
  href,
  children,
  className,
  onClick,
}: TransitionLinkProps) {
  const { navigateWithTransition } = useNavigationTransition();

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();

    console.log("🔗 TransitionLink clicked:", href);

    // Call custom onClick if provided
    onClick?.(e);

    // Navigate with transition
    navigateWithTransition(href);
  };

  return (
    <div
      onClick={handleClick}
      className={className}
      style={{ cursor: "pointer" }}
    >
      {children}
    </div>
  );
}
