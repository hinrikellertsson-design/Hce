import { prisma } from "@/lib/prisma";

export const SETTINGS_KEYS = {
  bankAccount: "payment_bank_account",
  bankAccountHolder: "payment_bank_account_holder",
  bankKennitala: "payment_bank_kennitala",
  paymentInstructions: "payment_instructions",
  organizerEmail: "organizer_email",
} as const;

export type SettingsMap = Record<(typeof SETTINGS_KEYS)[keyof typeof SETTINGS_KEYS], string>;

const DEFAULTS: SettingsMap = {
  [SETTINGS_KEYS.bankAccount]: "",
  [SETTINGS_KEYS.bankAccountHolder]: "Menntaskólinn í Kópavogi",
  [SETTINGS_KEYS.bankKennitala]: "",
  [SETTINGS_KEYS.paymentInstructions]:
    "Vinsamlegast greiðið með millifærslu á ofangreindan reikning fyrir viðburðinn. Merkið millifærsluna með nafni ykkar.",
  [SETTINGS_KEYS.organizerEmail]: "",
};

export async function getSettings(): Promise<SettingsMap> {
  const rows = await prisma.settings.findMany();
  const map = { ...DEFAULTS };
  for (const row of rows) {
    if (row.key in map) {
      (map as Record<string, string>)[row.key] = row.value;
    }
  }
  return map;
}

export async function updateSettings(values: Partial<SettingsMap>) {
  const entries = Object.entries(values) as [string, string][];
  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.settings.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      })
    )
  );
}
