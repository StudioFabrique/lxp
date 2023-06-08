import { useNavigate } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import Group from "../../utils/interfaces/group";
import GroupAddForm from "../../components/forms/group-form/group-add-form.component";

const GroupAdd = () => {
  const { error, isLoading, sendRequest } = useHttp();
  const navigate = useNavigate();

  const handleSubmit = (group: Group) => {
    console.log(group);
    /* sendRequest(
      { method: "post", path: "/group", body: group },
      (data: any) => {
        if (data) return navigate(-1);
      }
    ); */
  };

  return (
    <div className="m-4">
      <GroupAddForm
        onSubmitForm={handleSubmit}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
};

export default GroupAdd;
