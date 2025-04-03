import ProfileImageFileUpload from "../UI/image-file-upload/profile-image-file-upload";

const CompanyPictureUpload = () => {
  return (
    <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="card-body flex flex-col gap-4 p-6 rounded-lg">
        <p className="text-base-content text-lg font-medium">
          Téléverser un nouveau logo de l'organisme de formation
        </p>
        <ProfileImageFileUpload
          temporaryAvatar={{ file: null, url: null }}
          onSetTemporaryAvatar={() => {}}
          maxSize={100}
          existingAvatar={""}
        />
        <p className="ml-2 text-sm text-gray-600">
          Formats acceptés : .png, .jpg
        </p>
      </div>
    </div>
  );
};

export default CompanyPictureUpload;
