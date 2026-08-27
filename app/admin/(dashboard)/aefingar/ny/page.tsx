import { createSitting } from "@/app/actions/admin-sittings";
import { SittingForm } from "@/components/sitting-form";

export default function NewSittingPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Ný æfing</h1>
      <p className="mt-2 text-sm text-muted">
        Settu upp hádegis- eða kvöldverðaræfingu sem gestir geta bókað sig á.
      </p>
      <div className="mt-8">
        <SittingForm action={createSitting} submitLabel="Búa til æfingu" />
      </div>
    </div>
  );
}
