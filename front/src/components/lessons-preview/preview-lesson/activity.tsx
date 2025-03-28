/* eslint-disable @typescript-eslint/no-explicit-any */
import "./video-style.css";
import { useEffect, useState } from "react";
import Activity, { Resource } from "../../../utils/interfaces/activity";
import Markdown from "react-markdown";
import { ACTIVITIES, ACTIVITIES_VIDEOS } from "../../../config/urls";
import BaseReactPlayer from "react-player";
import Wrapper from "../../UI/wrapper/wrapper.component";
import FadeWrapper from "../../UI/fade-wrapper/fade-wrapper";
import { Edit3, File } from "lucide-react";
import { Link } from "react-router-dom";
import Can from "../../UI/can/can.component";

type ActivityProps = {
  lessonId: number;
  activity: Activity;
};

/* const md = markdownit(); */

const ActivityPreview = ({ lessonId, activity }: ActivityProps) => {
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

  const renderContent = () => {
    const contentMap = {
      text: (
        <Markdown className="prose prose-h1:text-primary prose-h1:text-center prose-a:text-center prose-img:max-w-4/6 prose-img:text-center prose-p:text-justify prose-ul:ml-8 max-w-[92%]">
          {value}
        </Markdown>
      ),
      video: (
        <div className="flex flex-col gap-2">
          <h3 className="text-base-content font-bold text-2xl">Vidéo</h3>
          <BaseReactPlayer url={url} controls />
        </div>
      ),
      image: (
        <div className="flex flex-col gap-2">
          <img src={`${ACTIVITIES}images/${activity.url}`} alt="Image" />
        </div>
      ),
      resource: (
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-base-content font-bold text-2xl">Resources</h3>
          <div className="flex flex-col gap-2">
            {pdfUrls
              .sort((a, b) => a.order - b.order)
              .map((pdf) => (
                <a
                  key={pdf.id}
                  href={pdf.url}
                  className="btn btn-primary text-base-100 flex items-center gap-2"
                  target="_blank"
                >
                  <File />
                  <span>{pdf.label}</span>
                </a>
              ))}
          </div>
        </div>
      ),
    };

    const content = contentMap[activity.type as keyof typeof contentMap];

    if (!content) return undefined;

    return (
      <Wrapper additionalClassname="bg-secondary/5 relative px-4">
        <Can action="update" object="lesson">
          <Link
            to={`/admin/lesson/edit/${lessonId}/preview/${activity.id}`}
            data-tip="Modifier l'activité"
            className="btn btn-xs px-1 btn-ghost absolute top-2 right-2 tooltip tooltip-left"
          >
            <Edit3 className="w-5 h-5" />
          </Link>
        </Can>
        <FadeWrapper>{content}</FadeWrapper>
      </Wrapper>
    );
  };

  return renderContent();
};

export default ActivityPreview;
