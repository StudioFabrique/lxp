import { useNavigate } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import User from "../../utils/interfaces/user";
import UserAddForm from "../../components/forms/user-form/user-add-form.component";

const UserAdd = () => {
  const { error, isLoading, sendRequest } = useHttp();
  const navigate = useNavigate();

  const handleSubmit = (user: User) => {
    console.log("event emit (form)");
    sendRequest({ method: "post", path: "/user", body: user }, (data: any) => {
      if (data) return navigate(-1);
    });
  };

  return (
    <div>
      <UserAddForm
        onSubmitForm={handleSubmit}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserAdd;
