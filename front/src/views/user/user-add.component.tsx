/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import UserAddForm from "../../components/forms/user-form/user-add-form.component";

import { useEffect } from "react";
import toast from "react-hot-toast";

const UserAdd = () => {
  const { error, isLoading, sendRequest } = useHttp();
  const navigate = useNavigate();

  const handleSubmit = (user: any, file: File | null) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({ user }));
    if (file) {
      formData.append("image", file);
    }

    sendRequest(
      { method: "post", path: "/user", body: formData },
      (data: any) => {
        if (data.success) {
          toast.success(data.message);
          return navigate("/admin/user");
        }
      },
    );
  };

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="p-10">
      <UserAddForm
        onSubmitForm={handleSubmit}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserAdd;
