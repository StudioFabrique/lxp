import React, { ChangeEvent } from "react";

interface AddTagProps {
  tag: string;
  onChangeValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export default function AddTag(props: AddTagProps) {
  const handleTagSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    props.onSubmit(event);
  };

  return (
    <form className="flex flex-col gap-y-2" onSubmit={handleTagSubmit}>
      <label htmlFor="">Tags</label>
      <input
        className="input input-sm focus:outline-none"
        type="text"
        value={props.tag}
        onChange={props.onChangeValue}
      />
    </form>
  );
}
