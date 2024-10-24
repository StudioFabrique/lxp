/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Activity from "../../../utils/interfaces/activity";
import markdownit from "markdown-it";
import { lessonActions } from "../../../store/redux-toolkit/lesson/lesson";
import Editor from "../../markdown-editor/mark-down-editor";
import Markdown from "react-markdown";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import { fromHtmlToMarkdown } from "../../../helpers/html-parser";
import Wrapper from "../../UI/wrapper/wrapper.component";
import { ACTIVITIES } from "../../../config/urls";

interface EditorProps {
  activity: Activity;
}

const md = markdownit();

export const BlogUpdate = ({ activity }: EditorProps) => {
  const dispatch = useDispatch();
  const { sendRequest, error, isLoading } = useHttp();
  const [value, setValue] = useState<string>("");
  const blogEdition = useSelector(
    (state: any) => state.lesson.blogEdition
  ) as number;

  /**
   * trigger la mise à jour du document markdown en cours d'édition au niveau
   * du composant parent
   * @param newValue string
   */
  /* const handleUpdate = async (newValue: string) => {
    onUpdate({
      ...activity,
      value: newValue,
    });
  };
  
 */
  /**
   * soumet les modifications apportées à une activité vers la bdd
   */
  const handleUpdate = (newValue: string) => {
    const applyData = (data: {
      success: boolean;
      message: string;
      response: Activity;
    }) => {
      if (data.success) {
        toast.success(data.message);
        dispatch(lessonActions.updateActivity(data.response));
      }
      dispatch(lessonActions.setBlogEdition(null));
    };
    const getData = async () => {
      sendRequest(
        {
          path: `/activity/${activity.id!}`,
          method: "put",
          body: {
            value: await fromHtmlToMarkdown(newValue),
            type: activity.type,
            order: activity.order,
            url: activity.url,
          },
        },
        applyData
      );
    };
    getData();
  };

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

  // gère les erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  /**
   * annule l'affichage de l'éditeur de texte sans prendre et les
   * mises à jour que le formateur aurait pu y apporter
   */
  const handleCancelEdition = () => {
    dispatch(lessonActions.setBlogEdition(null));
  };

  return (
    <div className="w-full">
      {blogEdition === activity.id ? (
        <>
          <Editor
            content={md.render(value)}
            isSubmitting={isLoading}
            onSubmit={handleUpdate}
            onCancel={handleCancelEdition}
          />
        </>
      ) : (
        <div className="w-full">
          <Wrapper>
            <div className="p-4 flex justify-center">
              <Markdown className="prose prose-h1:text-primary prose-h1:text-center prose-a:text-center prose-img:max-w-4/6 prose-img:text-center prose-p:text-justify prose-ul:ml-8 w-full">
                {value}
              </Markdown>
            </div>
          </Wrapper>
        </div>
      )}
    </div>
  );
};

export default BlogUpdate;
