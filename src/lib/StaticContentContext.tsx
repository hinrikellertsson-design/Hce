"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchStaticContent, type StaticContent } from "./queries";
import { isSupabaseConfigured } from "./supabase";

interface StaticContentState {
  content: StaticContent | null;
  loading: boolean;
  error: string | null;
  configured: boolean;
}

const StaticContentCtx = createContext<StaticContentState>({
  content: null,
  loading: true,
  error: null,
  configured: true,
});

export function StaticContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StaticContentState>({
    content: null,
    loading: isSupabaseConfigured,
    error: null,
    configured: isSupabaseConfigured,
  });

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    fetchStaticContent()
      .then((content) => {
        if (!cancelled) setState({ content, loading: false, error: null, configured: true });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ content: null, loading: false, error: err.message, configured: true });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <StaticContentCtx.Provider value={state}>{children}</StaticContentCtx.Provider>;
}

export function useStaticContent() {
  return useContext(StaticContentCtx);
}
