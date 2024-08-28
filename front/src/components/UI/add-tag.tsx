import React, { ChangeEvent } from "react";

interface AddTagProps {
  tag: string;
  placeholder?: string;
  error: boolean;
  onChangeValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export default function AddTag(props: AddTagProps) {
  const handleTagSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    props.onSubmit(event);
  };

  const style = `input input-sm focus:outline-none ${props.error ? "input-error" : ""}`;

  console.log("error : ", props.error);
  console.log({ style });

  return (
    <form className="flex flex-col gap-y-2" onSubmit={handleTagSubmit}>
      <label htmlFor="">Tags</label>
      <input
        className={style}
        type="text"
        placeholder={props.placeholder ?? ""}
        value={props.tag}
        onChange={props.onChangeValue}
      />
    </form>
  );
}
