/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import UserEditForm from "../../components/forms/user-form/user-add-form.component";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import User from "../../utils/interfaces/user";

const UserAdd = () => {
  const { error, isLoading, sendRequest } = useHttp();
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

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

  const initUserData = useCallback(() => {
    const applyData = (data: { user: User }) => {
      console.log({ data });
      setUser(data.user);
    };

    sendRequest({ path: `/user/data/${id}` }, applyData);
  }, [sendRequest, id]);

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (!user) initUserData();
  }, [user, initUserData]);

  return (
    <div className="p-10">
      <UserEditForm
        user={user}
        onSubmitForm={handleSubmit}
        error={error}
        isLoading={isLoading}
        fieldsDisabled={!user}
      />
    </div>
  );
};

export default UserAdd;
