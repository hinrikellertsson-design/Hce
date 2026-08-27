import { getSettings } from "@/lib/settings";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Stillingar</h1>
      <p className="mt-2 text-sm text-muted">
        Þessar upplýsingar birtast gestum í sjálfvirka greiðslutölvupóstinum
        sem sendur er viku fyrir hverja æfingu.
      </p>
      <div className="mt-8">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
