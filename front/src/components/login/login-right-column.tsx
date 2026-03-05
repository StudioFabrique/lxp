import bgPhoto from "../../assets/images/login/photo.jpeg";

const LoginRightColumn = () => {
  return (
    <div className="hidden xl:flex flex-col justify-center items-end relative col-span-2 w-full h-full">
      <img
        src={bgPhoto}
        alt="Décoration"
        className="w-auto h-full max-h-[85vh] min-h-[600px] object-contain rounded-l-2xl"
      />
    </div>
  );
};

export default LoginRightColumn;
