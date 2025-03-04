/* eslint-disable @typescript-eslint/no-explicit-any */
import "./video-style.css";
import { useEffect, useState } from "react";
import Activity, { Resource } from "../../../utils/interfaces/activity";
import Markdown from "react-markdown";
import { ACTIVITIES, ACTIVITIES_VIDEOS } from "../../../config/urls";
import BaseReactPlayer from "react-player";
import Wrapper from "../../UI/wrapper/wrapper.component";
import FadeWrapper from "../../UI/fade-wrapper/fade-wrapper";
import { File } from "lucide-react";

type ActivityProps = {
  activity: Activity;
};

/* const md = markdownit(); */

const ActivityPreview = ({ activity }: ActivityProps) => {
  console.log({ activity });

  const [value, setValue] = useState<string>("");
  const [url, setUrl] = useState("");

  // case when a activity contains a set of pdf files
  const [pdfUrls, setPdfUrls] = useState<Resource[]>([]);

  useEffect(() => {
    if (activity.url !== undefined) {
      if (activity.url.startsWith("http")) {
        setUrl(activity.url);
      } else {
        setUrl(ACTIVITIES_VIDEOS + activity.url);
      }
    }
  }, [activity.url]);

  // Récupération et formatage des ressources pdf
  useEffect(() => {
    if (activity.type === "resource" && activity.resourceActivities) {
      const resources = activity.resourceActivities.map((act) => ({
        ...act,
        url: act.url.startsWith("http")
          ? act.url
          : `${ACTIVITIES}files/${act.url}`,
      }));

      setPdfUrls(resources);
    }
  }, [activity.resourceActivities, activity.type]);

  /**
   * récupère le contenu d'un fichier markdown depuis le serveur
   */
  useEffect(() => {
    if (activity && activity !== undefined) {
      fetch(`${ACTIVITIES}${activity.url}`)
        .then((response: any) => response.text())
        //.then((text) => md.render(text))
        .then((mdContent: string) => {
          setValue(mdContent);
        });
    }
  }, [activity, activity.url]);

  switch (activity.type) {
    case "text":
      return (
        <Wrapper additionalClassname="bg-secondary/5">
          <FadeWrapper>
            <Markdown className="prose prose-h1:text-primary prose-h1:text-center prose-a:text-center prose-img:max-w-4/6 prose-img:text-center prose-p:text-justify prose-ul:ml-8 max-w-[95%]">
              {value}
            </Markdown>
          </FadeWrapper>
        </Wrapper>
      );
    case "video":
      return (
        <Wrapper>
          <FadeWrapper>
            <div className="flex flex-col gap-2">
              <h3 className="text-base-content font-bold text-2xl">Vidéo</h3>
              <BaseReactPlayer url={url} controls />
            </div>
          </FadeWrapper>
        </Wrapper>
      );
    case "image":
      return (
        <Wrapper>
          <FadeWrapper>
            <div className="flex flex-col gap-2">
              <img src={`${ACTIVITIES}images/${activity.url}`} alt="Image" />
            </div>
          </FadeWrapper>
        </Wrapper>
      );
    case "resource":
      return (
        <Wrapper>
          <FadeWrapper>
            <div className="flex flex-col gap-4">
              <h3 className="text-base-content font-bold text-2xl">
                Resources
              </h3>
              <div className="flex flex-col gap-2">
                {pdfUrls
                  .sort((a, b) => a.order - b.order)
                  .map((pdf) => (
                    <a
                      key={pdf.id}
                      href={pdf.url}
                      className="btn btn-primary flex items-center gap-2"
                      target="_blank"
                    >
                      <File />
                      <span>{pdf.label}</span>
                    </a>
                  ))}
              </div>
            </div>
          </FadeWrapper>
        </Wrapper>
      );
    default:
      return undefined;
  }
};

export default ActivityPreview;
