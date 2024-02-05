/* import markdownit from "markdown-it"; */
import { useEffect, useState } from "react";
import Activity from "../../../utils/interfaces/activity";
import Markdown from "react-markdown";

type ActivityProps = {
  activity: Activity;
};

/* const md = markdownit(); */

const ActivityPreview = ({ activity }: ActivityProps) => {
  const [value, setValue] = useState<string>("");

  /**
   * récupère le contenu d'un fichier markdown depuis le serveur
   */
  useEffect(() => {
    if (activity && activity !== undefined) {
      fetch(`http://localhost:5001/activities/${activity.url}`)
        .then((response: any) => response.text())
        //.then((text) => md.render(text))
        .then((mdContent: string) => {
          setValue(mdContent);
        });
    }
  }, [activity, activity.url]);

  return (
    <Markdown className="prose prose-h1:text-primary prose-h1:text-center prose-a:text-center prose-img:max-w-4/6 prose-img:text-center prose-p:text-justify prose-ul:ml-8 max-w-none">
      {value}
    </Markdown>
  );
};

export default ActivityPreview;
