import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Badge from "../../utils/interfaces/badge";
import ImportBadges from "../skills/import-badges.component";
import BadgeItem from "./badge-item.component";
import { validateImageFile } from "../../utils/validate-image-file";
import { maxSize } from "../../config/badge-image-max-size";
import { parcoursAction } from "../../store/redux-toolkit/parcours";
import UploadIcon from "../UI/svg-icons/upload-icon.component";

type Props = {
  selectedBadge?: any;
  onSubmitBadge: (badge: any) => void;
};

const BadgeList: FC<Props> = ({ selectedBadge, onSubmitBadge }) => {
  const badgeList = useSelector((state: any) => state.parcours.badges);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const [updatedFile, setUdpatedFile] = useState(false);

  const handleUpdateBadge = (newBadge: Badge) => {
    onSubmitBadge(newBadge);
  };

  const uploadFile = () => {
    if (fileRef) {
      fileRef.current?.click();
    }
  };

  console.log("badge list rendering");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        if (validateImageFile(selectedFile, maxSize)) {
          dispatch(
            parcoursAction.updateBadgeImage({
              id: selectedBadge.id,
              image: URL.createObjectURL(selectedFile),
            })
          );
          setUdpatedFile(true);
        }
      } else {
        console.log("Fichier non autorisé pour une raison ou une autre.");
      }
    }
  };

  useEffect(() => {
    if (updatedFile) {
      onSubmitBadge(
        badgeList.find((item: Badge) => item.id === selectedBadge.id)
      );
      setUdpatedFile(false);
    }
  }, [updatedFile, badgeList, onSubmitBadge, selectedBadge]);

  let content = (
    <>
      {badgeList.length > 0 ? (
        <ul className="grid grid-cols-5 px-4 gap-x-2 gap-y-2 mt-2">
          {badgeList.map((item: Badge) => (
            <React.Fragment key={item.id}>
              {item.title ? (
                <>
                  {item.id === selectedBadge?.id ? (
                    <div className="indicator" key={item.id}>
                      <span
                        className="indicator-item avatar bg-info rounded-full p-1 cursor-pointer"
                        onClick={uploadFile}
                      >
                        <UploadIcon size={4} color="neutral" />
                      </span>
                      <BadgeItem
                        badge={item}
                        isSelected={true}
                        onUpdateBadge={handleUpdateBadge}
                      />
                    </div>
                  ) : (
                    <BadgeItem
                      badge={item}
                      isSelected={false}
                      onUpdateBadge={handleUpdateBadge}
                    />
                  )}
                </>
              ) : (
                <div className="indicator" key={item.id}>
                  <span className="indicator-item badge badge-warning">
                    ...
                  </span>
                  <BadgeItem
                    badge={item}
                    isSelected={item.id === selectedBadge?.id}
                    onUpdateBadge={handleUpdateBadge}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-y-4 my-8">
          <p>Aucun badge dans la liste</p>
          <ImportBadges label="Importer des badges" outline={false} />
        </div>
      )}
      <input
        className="hidden"
        ref={fileRef}
        type="file"
        onChange={handleFileChange}
      />
    </>
  );

  return <>{content}</>;
};

const MemoizedBadgeList = React.memo(BadgeList);

export default MemoizedBadgeList;
