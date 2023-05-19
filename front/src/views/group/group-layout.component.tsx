import { Outlet, useNavigate } from "react-router-dom";

const GroupLayout = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(-1);
  };
  return (
    <div>
      <button onClick={handleClick} className="btn">
        Retour
      </button>
      <Outlet />
    </div>
  );
};

export default GroupLayout;
