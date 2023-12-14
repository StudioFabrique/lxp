import { useDispatch, useSelector } from "react-redux";
import Editor from "../markdown-editor/mark-down-editor";
import { lessonActions } from "../../store/redux-toolkit/lesson/lesson";

interface CurrentBlockProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (value: any) => void;
}

export default function CurrentBlock({ onSubmit }: CurrentBlockProps) {
  const dispatch = useDispatch();
  const currentType = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.lesson.currentType
  ) as string;

  const handleCancel = () => {
    dispatch(lessonActions.resetCurrentType());
  };

  return (
    <>
      {currentType ? (
        <>
          {currentType === "text" ? (
            <Editor onSubmit={onSubmit} onCancel={handleCancel} />
          ) : null}
        </>
      ) : null}
    </>
  );
}
