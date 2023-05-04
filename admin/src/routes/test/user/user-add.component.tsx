import UserAddForm from "../../../components/testUserForm/add/user-add-form.component";
import useHttp from "../../../hooks/use-http";
import User from "../../../utils/interfaces/user";

const UserAdd = () => {
  const { error, isLoading, sendRequest } = useHttp();

  const handleSubmit = (user: User) => {
    sendRequest(
      { method: "post", path: "/userTest", body: user },
      (data: any) => ""
    );
  };

  return (
    <div className="h-full">
      <UserAddForm
        onSubmit={handleSubmit}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserAdd;
