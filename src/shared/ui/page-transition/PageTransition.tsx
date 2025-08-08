"use client";

import { useEffect, useState } from "react";
import { useNavigationTransition } from "@/shared/contexts/NavigationTransitionContext";

export function PageTransition() {
  const [isVisible, setIsVisible] = useState(false);
  const { isTransitioning } = useNavigationTransition();

  useEffect(() => {
    if (isTransitioning) {
      console.log("🎨 Transition component activated");
      // Small delay then start the visual transition
      const startTimer = setTimeout(() => {
        console.log("✨ Starting visual transition");
        setIsVisible(true);
      }, 50);

      return () => clearTimeout(startTimer);
    } else {
      console.log("🎭 Transition component deactivated");
      // Fade out when transition ends
      setIsVisible(false);
    }
  }, [isTransitioning]);

  if (!isTransitioning) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {/* Page content fade overlay */}
      <div
        className={`
          absolute inset-0 
          bg-black/20
          transition-opacity duration-300 ease-in-out
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Main flowing background */}
      <div
        className={`
          absolute inset-0 
          bg-gradient-to-br from-purple-400/80 via-pink-300/70 to-blue-400/80
          backdrop-blur-sm
          transition-all duration-500 ease-in-out
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Floating color blob 1 - Center */}
      <div
        className={`
          absolute w-96 h-96 
          bg-gradient-radial from-blue-300/90 via-purple-400/70 to-transparent
          rounded-full blur-3xl
          transition-opacity duration-600 ease-out
          blob-center
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Floating color blob 2 - Top right */}
      <div
        className={`
          absolute w-80 h-80 
          bg-gradient-radial from-pink-400/80 via-purple-300/60 to-transparent
          rounded-full blur-2xl
          transition-opacity duration-700 ease-out delay-100
          blob-corner
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Floating color blob 3 - Bottom left */}
      <div
        className={`
          absolute w-72 h-72 
          bg-gradient-radial from-purple-500/70 via-blue-400/50 to-transparent
          rounded-full blur-2xl
          transition-opacity duration-800 ease-out delay-200
          blob-corner-slow
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Floating color blob 4 - Mid right */}
      <div
        className={`
          absolute top-1/3 right-1/4 w-64 h-64 
          bg-gradient-radial from-indigo-400/60 via-pink-300/40 to-transparent
          rounded-full blur-xl
          transition-opacity duration-900 ease-out delay-300
          blob-drift
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Floating color blob 5 - Top center */}
      <div
        className={`
          absolute top-1/4 left-1/3 w-56 h-56 
          bg-gradient-radial from-cyan-300/50 via-purple-400/30 to-transparent
          rounded-full blur-xl
          transition-opacity duration-1000 ease-out delay-400
          blob-pulse-drift
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Debug indicator - temporary */}
      <div
        className={`
          absolute top-8 left-8 z-10
          bg-red-600 text-white px-4 py-2 rounded
          font-bold text-sm
          transition-opacity duration-300
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
      >
        TRANSITION ACTIVE
      </div>

      {/* Overall blur overlay */}
      <div
        className={`
          absolute inset-0 
          backdrop-blur-md
          transition-all duration-500 ease-in-out delay-200
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
      />
    </div>
  );
}
