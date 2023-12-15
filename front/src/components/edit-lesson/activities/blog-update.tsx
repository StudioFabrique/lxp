/* eslint-disable @typescript-eslint/no-explicit-any */
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Activity from "../../../utils/interfaces/activity";
import { markdownToHtml } from "../../../helpers/html-parser";
import { lessonActions } from "../../../store/redux-toolkit/lesson/lesson";
import Editor from "../../markdown-editor/mark-down-editor";
import Markdown from "react-markdown";

interface EditorProps {
  activity: Activity;
  onUpdate: (activity: any) => void;
}

export const BlogUpdate = ({ activity, onUpdate }: EditorProps) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState<string>("");
  const blogEdition = useSelector(
    (state: any) => state.lesson.blogEdition
  ) as number;

  console.log("rendering...");

  const handleUpdate = (newValue: string) => {
    onUpdate({
      ...activity,
      value: newValue,
    });
    dispatch(lessonActions.setBlogEdition(null));
  };

  useEffect(() => {
    if (activity && activity !== undefined) {
      fetch(`http://localhost:5001/activities/${activity.url}`)
        .then((response: any) => response.text())
        //.then((text) => markdownToHtml(text))
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

  return (
    <div className="my-8">
      {blogEdition === activity!.id ? (
        <>
          <Editor
            content={value}
            onSubmit={handleUpdate}
            onCancel={handleCancelEdition}
          />
        </>
      ) : (
        <>
          <Markdown>{value}</Markdown>
          <div className="flex justify-end mt-4">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => handleToggleEditionMode(activity!.id!)}
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
