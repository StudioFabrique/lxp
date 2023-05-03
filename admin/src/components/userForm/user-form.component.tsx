import { FC, FormEvent } from "react";
import { Add /* ,Edit */ } from "./buttons";
import formInput from "./formInput";

const UserForm: FC<{
  action: "add" | /* "edit" | */ "";
  /* user?: any */
}> = (props) => {
  const setButtonComponent = () => {
    switch (props.action) {
      case "add":
        return <Add />;
      /* case "edit":
        return <Edit />; */
      default:
        return <Add />;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form className="flex flex-col gap-y-6 pb" onSubmit={handleSubmit}>
      {formInput.map((input, i) => (
        <div className="flex justify-between gap-x-5" key={i}>
          <label>{input.label}</label>
          <input type={input.type}></input>
        </div>
      ))}
      {setButtonComponent()}
    </form>
  );
};

export default UserForm;
