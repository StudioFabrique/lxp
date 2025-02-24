/* eslint-disable @typescript-eslint/no-explicit-any */
import "./video-style.css";
import { useEffect, useState } from "react";
import Activity from "../../../utils/interfaces/activity";
import Markdown from "react-markdown";
import { ACTIVITIES, ACTIVITIES_VIDEOS } from "../../../config/urls";
import BaseReactPlayer from "react-player";
import Wrapper from "../../UI/wrapper/wrapper.component";
import FadeWrapper from "../../UI/fade-wrapper/fade-wrapper";

type ActivityProps = {
  activity: Activity;
};

/* const md = markdownit(); */

const ActivityPreview = ({ activity }: ActivityProps) => {
  const [value, setValue] = useState<string>("");

  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    if (activity.url !== undefined) {
      if (activity.url.startsWith("http")) {
        setVideoUrl(activity.url);
      } else {
        setVideoUrl(ACTIVITIES_VIDEOS + activity.url);
      }
    }
  }, [activity.url]);

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
            <Markdown className="prose prose-h1:text-primary prose-h1:text-center prose-a:text-center prose-img:max-w-4/6 prose-img:text-center prose-p:text-justify prose-ul:ml-8 max-w-none">
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
              <BaseReactPlayer url={videoUrl} controls />
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
    default:
      return undefined;
  }
};

export default ActivityPreview;
