"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function onLogout() {
    try {
      setIsLoggingOut(true);
      await fetch("/api/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <header className="topbar">
      <h2>Apollo</h2>
      <div className="topbarActions">
        <button
          className="topbarButton"
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging out…" : "Logout"}
        </button>
      </div>
    </header>
  );
}
