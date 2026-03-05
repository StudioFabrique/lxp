interface LessonsQualityRadialProgressProps {
  value?: number;
}

const LessonsQualityRadialProgress = ({
  value,
}: LessonsQualityRadialProgressProps) => {
  return (
    <div className="p-5 flex flex-col gap-5 items-center">
      <div
        className="radial-progress bg-secondary text-primary-content border-primary border-4"
        style={{ "--value": value } as React.CSSProperties}
        aria-valuenow={value}
        role="progressbar"
      >
        {value ?? "..."}%
      </div>
      <span className="text-neutral-content w-52 text-center">
        Qualité globale des cours (selon les étudiants)
      </span>
    </div>
  );
};

export default LessonsQualityRadialProgress;
