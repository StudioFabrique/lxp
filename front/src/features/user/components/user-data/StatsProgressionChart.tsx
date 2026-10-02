export function StatsProgressionChart(props: { value: number }) {
  return (
    <span className="flex gap-x-2 items-center w-full">
      <progress
        className="progress progress-primary w-96"
        value={props.value}
        max="100"
      ></progress>
      <p className="w-12 text-primary font-semibold">{props.value}%</p>
    </span>
  );
}
