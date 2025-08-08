"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface NavigationTransitionContextType {
  isTransitioning: boolean;
  navigateWithTransition: (href: string) => void;
}

const NavigationTransitionContext = createContext<
  NavigationTransitionContextType | undefined
>(undefined);

interface NavigationTransitionProviderProps {
  children: ReactNode;
}

export function NavigationTransitionProvider({
  children,
}: NavigationTransitionProviderProps) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateWithTransition = useCallback(
    (href: string) => {
      // Don't navigate if already transitioning
      if (isTransitioning) return;

      console.log("🚀 Starting transition to:", href);
      // Start transition immediately on click
      setIsTransitioning(true);

      // Wait a bit to show the transition, then navigate
      setTimeout(() => {
        console.log("⚡ Navigating to:", href);
        router.push(href);

        // Keep transition visible after navigation
        setTimeout(() => {
          console.log("✅ Ending transition");
          setIsTransitioning(false);
        }, 1500); // Keep visible for 1.5s after navigation
      }, 300); // Show transition for 300ms before navigating
    },
    [router, isTransitioning],
  );

  return (
    <NavigationTransitionContext.Provider
      value={{
        isTransitioning,
        navigateWithTransition,
      }}
    >
      {children}
    </NavigationTransitionContext.Provider>
  );
}

export function useNavigationTransition() {
  const context = useContext(NavigationTransitionContext);
  if (context === undefined) {
    throw new Error(
      "useNavigationTransition must be used within a NavigationTransitionProvider",
    );
  }
  return context;
}
