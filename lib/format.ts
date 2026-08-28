import { format } from "date-fns";
import { is } from "date-fns/locale";

export function formatKronur(amount: number) {
  return new Intl.NumberFormat("is-IS", {
    style: "currency",
    currency: "ISK",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateLong(date: Date) {
  return format(date, "EEEE d. MMMM yyyy", { locale: is });
}

export function formatDateShort(date: Date) {
  return format(date, "d. MMM yyyy", { locale: is });
}

export function mealTypeLabel(mealType: "LUNCH" | "DINNER") {
  return mealType === "LUNCH" ? "Hádegisverður" : "Kvöldverður";
}
