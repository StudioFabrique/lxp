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

interface EditorProps {
  activity: Activity;
  onUpdate: (activity: any) => void;
}

const md = markdownit();

export const BlogUpdate = ({ activity, onUpdate }: EditorProps) => {
  const dispatch = useDispatch();
  const { sendRequest } = useHttp();
  const [value, setValue] = useState<string>("");
  const blogEdition = useSelector(
    (state: any) => state.lesson.blogEdition
  ) as number;

  const handleUpdate = async (newValue: string) => {
    onUpdate({
      ...activity,
      value: newValue,
    });
    dispatch(lessonActions.setBlogEdition(null));
  };

  const handleDeleteActivity = (id: number) => {
    const applyData = (data: any) => {
      console.log("from delete : ", data);
    };
    sendRequest(
      {
        path: `/activity/${id}`,
        method: "delete",
      },
      applyData
    );
  };

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

  const handleToggleEditionMode = (id: number) => {
    dispatch(lessonActions.setBlogEdition(id));
  };

  const handleCancelEdition = () => {
    dispatch(lessonActions.setBlogEdition(null));
  };

  //console.log(value);

  return (
    <div className="my-8">
      {blogEdition === activity.id ? (
        <>
          <Editor
            content={md.render(value)}
            onSubmit={handleUpdate}
            onCancel={handleCancelEdition}
          />
        </>
      ) : (
        <>
          <Markdown className="prose">{value}</Markdown>
          <div className="flex justify-end items-center gap-x-2 mt-4">
            <button
              className="btn btn-outline btn-warning btn-sm"
              onClick={() => handleDeleteActivity(activity.id!)}
            >
              Supprimer
            </button>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => handleToggleEditionMode(activity.id!)}
            >
              Editer
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BlogUpdate;
