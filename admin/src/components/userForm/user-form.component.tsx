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
    <form
      {...formInput.map((input) => <label>{input.label}</label>)}
      onSubmit={handleSubmit}
    >
      {setButtonComponent()}
    </form>
  );
};

export default UserForm;
