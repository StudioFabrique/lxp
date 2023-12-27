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

interface EditorProps {
  activity: Activity;
  isSubmitting: boolean;
  onUpdate: (activity: any) => void;
}

const md = markdownit();

export const BlogUpdate = ({
  activity,
  isSubmitting,
  onUpdate,
}: EditorProps) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState<string>("");
  const blogEdition = useSelector(
    (state: any) => state.lesson.blogEdition
  ) as number;

  const handleUpdate = async (newValue: string) => {
    onUpdate({
      ...activity,
      value: newValue,
    });
  };

  const setItemToDelete = () => {
    dispatch(lessonActions.setActivityToDelete(activity));
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

  return (
    <>
      <div className="my-8">
        {blogEdition === activity.id ? (
          <>
            <Editor
              content={md.render(value)}
              isSubmitting={isSubmitting}
              onSubmit={handleUpdate}
              onCancel={handleCancelEdition}
            />
          </>
        ) : (
          <>
            <div className="px-4 py-2 border border-primary/50 rounded-lg shadow-lg">
              <Markdown className="prose">{value}</Markdown>
            </div>
            <div className="flex justify-end items-center gap-x-2 mt-4">
              <button
                className="btn btn-outline btn-warning btn-sm"
                onClick={setItemToDelete}
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
    </>
  );
};

export default BlogUpdate;
