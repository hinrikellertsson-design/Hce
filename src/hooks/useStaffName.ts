"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "hlidin_staff_name";

// No staff login for the MVP — each device remembers a display name locally so
// task check-offs and handover notes can be attributed to someone.
export function useStaffName() {
  const [name, setNameState] = useState<string>("");

  useEffect(() => {
    setNameState(window.localStorage.getItem(STORAGE_KEY) ?? "");
  }, []);

  const setName = useCallback((value: string) => {
    window.localStorage.setItem(STORAGE_KEY, value);
    setNameState(value);
  }, []);

  return { name, setName };
}
