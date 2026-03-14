"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error || "Invalid username or password.");
        return;
      }

      router.push(nextPath);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="loginPage">
      <div className="loginCard">
        <h1 className="loginTitle">Login</h1>
        <p className="loginSubTitle">Use the static credentials to enter the dashboard.</p>

        <form className="loginForm" onSubmit={onSubmit}>
          <label className="loginLabel">
            Username
            <input
              className="loginInput"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className="loginLabel">
            Password
            <input
              className="loginInput"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <div className="loginError">{error}</div> : null}

          <button className="loginButton" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="loginHint">
          Static creds: <code>admin</code> / <code>admin123</code>
        </div>
      </div>
    </div>
  );
}

