import { useCallback, useEffect } from "react";
import Loader from "../../../components/UI/loader";
import ImageHeader from "../../../components/image-header/image-header";
import useHttp from "../../../hooks/use-http";
import { useParams } from "react-router-dom";
import FadeWrapper from "../../../components/UI/fade-wrapper/fade-wrapper";
import { useDispatch } from "react-redux";

const LayoutCourseEdit = () => {
  const { sendRequest, isLoading } = useHttp();
  const { courseId } = useParams();
  const dispatch = useDispatch();

  /**
   * enregistrement de l'image du parcours dans la bdd
   */
  const updateImage = useCallback(
    (image: File) => {
      const formData = new FormData();
      formData.append("courseId", courseId!);
      formData.append("image", image);
      const processData = (_data: any) => {};
      sendRequest(
        {
          path: "/parcours/update-image",
          method: "put",
          body: formData,
        },
        processData
      );
    },
    [courseId, sendRequest]
  );

  useEffect(() => {
    const applyData = (data: any) => {
      console.log({ data });
    };
    sendRequest(
      {
        path: `/course/infos/${courseId}`,
      },
      applyData
    );
  }, [courseId, sendRequest]);

  return (
    <div className="w-full h-full flex flex-col justify-start items-center px-8 py-2">
      {isLoading ? (
        <Loader />
      ) : (
        <FadeWrapper>
          <ImageHeader
            defaultImage="/images/parcours-default.jpg"
            title="TOTO"
            parentTitle="TATA"
            onUpdateImage={updateImage}
          />
        </FadeWrapper>
      )}
    </div>
  );
};

export default LayoutCourseEdit;
