import ActivityTypes from "./activity-types";

export default function AddBlock({
  onActivityType,
}: {
  onActivityType: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <section className="flex flex-col items-start gap-y-4">
      <ActivityTypes onActivityType={onActivityType} />
    </section>
  );
}
