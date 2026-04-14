import { useAuthActions } from "@convex-dev/auth/react";
import { LogIn } from "lucide-react";
import { useState } from "react";

export function AuthUI() {
  const { signIn } = useAuthActions();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => void signIn("google", { redirectTo: "/profile" })}
      className="relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-brand-primary/10 px-5 py-2.5 font-bold text-brand-primary transition-all hover:bg-brand-primary/20 hover:shadow-[0_0_20px_rgba(0,255,156,0.2)] focus:outline-none"
    >
      <div
        className="absolute inset-0 bg-white/10 opacity-0 transition-opacity"
        style={{
          opacity: isHovered ? 0.05 : 0,
        }}
      />
      <LogIn size={18} className="relative z-10" />
      <span className="relative z-10 text-sm tracking-wide">Sign in to Track</span>
    </button>
  );
}
