import ActivityTypes from "./activity-types";

export default function AddBlock({
  onActivityType,
}: {
  onActivityType: (activityType: string) => void;
}) {
  return (
    <section className="flex flex-col items-start gap-y-4">
      <h2 className="text-xl font-bold text-primary">Ajouter un bloc</h2>
      <ActivityTypes onActivityType={onActivityType} />
    </section>
  );
}
