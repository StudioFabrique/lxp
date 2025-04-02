import ProfileImageFileUpload from "../UI/image-file-upload/profile-image-file-upload";

const CompanyPictureUpload = () => {
  return (
    <div>
      <p>Téléverser une image de l'entreprise/organisame de formation</p>
      <ProfileImageFileUpload
        temporaryAvatar={{ file: null, url: null }}
        onSetTemporaryAvatar={() => {}}
        maxSize={100}
        existingAvatar={""}
      />
    </div>
  );
};

export default CompanyPictureUpload;
