import { Skeleton } from "./ui/skeleton";
import { useTheme } from "./context/theme-context";
import { useState } from "react";

export default function LocationSkeleton() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [showSpinner, setShowSpinner] = useState(false);

  return (
    <div className="space-y-6 relative">
      {/* Skeleton Layout */}
      <div className="grid gap-6">
        <Skeleton className="h-10 w-50 rounded-lg" />
        <Skeleton className="h-75 w-full rounded-lg" />
      </div>

      <div className="grid gap-6">
        <Skeleton className="h-75 w-full rounded-lg" />
        <Skeleton className="h-75 w-full rounded-lg" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-75 w-full rounded-lg" />
          <Skeleton className="h-75 w-full rounded-lg" />
        </div>
      </div>

      {/* Center Overlay */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
        {!showSpinner ? (
          <img
            src={isDark ? "/logo.png" : "/logo1.png"}
            alt="Loading"
            className="w-100"
            style={{
              animation: "flip 3s ease-in-out 3",
            }}
            onAnimationEnd={() => setShowSpinner(true)}
          />
        ) : (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-spring-green-400"></div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes flip {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(180deg); }
          100% { transform: rotateY(0deg); }
        }
      `}</style>
    </div>
  );
}