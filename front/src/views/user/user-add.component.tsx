import { useNavigate } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import UserAddForm from "../../components/forms/user-form/user-add-form.component";

const UserAdd = () => {
  const { error, isLoading, sendRequest } = useHttp();
  const navigate = useNavigate();

  const handleSubmit = (user: any) => {
    console.log("event emit (form)");
    sendRequest({ method: "post", path: "/user", body: user }, (data: any) => {
      if (data) return navigate(-1);
    });
  };

  return (
    <div className="p-5">
      <UserAddForm
        onSubmitForm={handleSubmit}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserAdd;
