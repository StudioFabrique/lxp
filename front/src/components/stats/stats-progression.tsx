import { ProgressionData } from "../../views/teacher/hooks/useTeacher";

type Props = {
  completionModules: ProgressionData[];
  parcoursCompletion: number;
};

export default function StatsProgression(props: Props) {
  return (
    <>
      {props.completionModules.map((module) => (
        <div
          key={module.id}
          className="flex flex-col md:flex-row md:justify-between gap-y-42 overflow-auto pr-2"
        >
          <div className="flex gap-x-4 items-center w-full mb-2">
            <span className="w-full flex gap-x-4 items-center">
              <img
                src={`data:image/jpeg;base64,${module.thumb}`}
                alt={`thumb de ${module.title}`}
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="flex capitalize font-bold flex-1">
                {module.title}
              </span>
            </span>
            <StatsProgressionChart value={module.stats.progress} />
          </div>
        </div>
      ))}
    </>
  );
}

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
