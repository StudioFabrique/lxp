/* eslint-disable @typescript-eslint/no-explicit-any */
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import ImageHeader from "../../components/image-header";
import HeaderMenu from "../../components/UI/header-menu";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import Progression from "../../components/module-view/progression/progression";
import Loader from "../../components/UI/loader";
import ProgressBar from "../../components/module-view/progress-bar";
import Objectifs from "../../components/module-view/objectifs";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import Contacts from "../../components/module-view/contacts";

const ModuleView = () => {
  const { sendRequest, isLoading } = useHttp(true);
  const { moduleId } = useParams();

  const [moduleData, setModuleData] = useState<any | null>(null);

  useEffect(() => {
    const applyData = (data: any) => {
      console.log({ DonnéesDuModule: data.data });
      setModuleData(data.data);
    };

    sendRequest(
      { path: `/modules/detail/${moduleId}`, method: "get" },
      applyData
    );
  }, [moduleId, sendRequest]);

  return isLoading ? (
    <Loader />
  ) : (
    moduleData && (
      <div className="px-8 p-4">
        <FadeWrapper>
          <div className="w-full">
            <ImageHeader
              imageUrl={`data:image/jpeg;base64,${moduleData.image}`}
              title={moduleData.title}
              subTitle={`${moduleData.parcours} > Module`}
              children={[<></>, <HeaderMenu />]}
            />
          </div>

          <div className="mt-5 grid grid-cols-4 gap-5">
            <Progression courses={moduleData.courses} />
            <div className="flex flex-col gap-5 col-span-3">
              <ProgressBar courses={moduleData.courses} />
              <Objectifs objectives={moduleData.bonusSkills} />
              <div className="grid grid-cols-2 gap-5">
                <Contacts contacts={moduleData.contacts} />
                {/* <Tags tags={moduleData.tags} /> */}
                <Wrapper>
                  <div></div>
                </Wrapper>
              </div>
              <Wrapper>
                <div></div>
              </Wrapper>
            </div>
          </div>
        </FadeWrapper>
      </div>
    )
  );
};

export default ModuleView;
