import UserAddForm from "../../components/UserForm/add/user-add-form.component";
import useHttp from "../../hooks/use-http";
import User from "../../utils/interfaces/user";

const UserAdd = () => {
  const { error, isLoading, sendRequest } = useHttp();

  const handleSubmit = (user: User) => {
    console.log("event emit (form)");

    sendRequest(
      { method: "post", path: "/userTest", body: user },
      (data: any) => console.log(data)
    );
  };

  return (
    <div className="min-h-screen w-screen flex justify-center">
      <UserAddForm
        onSubmitForm={handleSubmit}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserAdd;
