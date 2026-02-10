import { ProgressionData } from "../../views/teacher/hooks/useTeacher";

type Props = {
  completionModules: ProgressionData[];
  parcoursCompletion: number;
};

export default function StatsProgression(props: Props) {
  const style = {
    "--value": props.parcoursCompletion,
    "--size": "2.5rem",
    "--thickness": "4px",
    "--font-size": "8px",
  } as React.CSSProperties;
  return (
    <>
      {props.completionModules.map((module) => (
        <div
          key={module.id}
          className="flex flex-col md:flex-row md:justify-between gap-y-42 overflow-auto pr-2"
        >
          <div className="flex gap-x-4 justify-between items-center w-full mb-2">
            <span className="flex gap-x-4 items-center">
              <img
                src={`data:image/jpeg;base64,${module.thumb}`}
                alt={`thumb de ${module.title}`}
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="capitalize font-bold">{module.title}</span>
            </span>
            <span className="flex justify-end items-start">
              <div
                className={"radial-progress text-primary md:mt-0 mt-2"}
                style={style}
                role="progressbar"
              >
                <p style={{ fontSize: "10px" }}>{module.stats.progress} %</p>
              </div>
            </span>
          </div>
        </div>
      ))}
    </>
  );
}
