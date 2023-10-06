import React from "react";

interface ObjectivesFormProps {
  newObjective: any;
  onSubmit: (value: string) => void;
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
      </form>
    );
  }
);

export default ObjectivesForm;
