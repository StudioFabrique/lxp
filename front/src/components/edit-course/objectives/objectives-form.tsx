import React from "react";

interface ObjectivesFormProps {
  newObjective: any;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

const ObjectivesForm = React.forwardRef<HTMLInputElement, ObjectivesFormProps>(
  (props, ref) => {
    const { newObjective } = props;

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      if (newObjective.isValid) {
        props.onSubmit(newObjective.value);
      } else console.log("oops");
    };

    return (
      <form className="w-full" onSubmit={handleSubmit}>
        <input
          className="w-full flex-1 input input-sm focus:outline-none"
          ref={ref}
          type="text"
          id="objectif"
          name="objectif"
          defaultValue={newObjective.value}
          onChange={newObjective.valueChangeHandler}
          onBlur={newObjective.valueBlurHandler}
          placeholder="Entrez un nouvel objectif"
        />
        <div className="flex justify-between items-center pt-2">
          <p className="text-xs text-secondary pl-1">
            Appuyez sur "Entrée" après saisi un objectif de cours pour
            l'enregistrer.
          </p>
          <button
            className="btn btn-primary btn-outline btn-sm"
            onClick={props.onCancel}
          >
            Annuler
          </button>
        </div>
      </form>
    );
  },
);

export default ObjectivesForm;
