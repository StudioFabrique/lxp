/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import MarkDownEditor from "../../../components/edit-course/markdown-editor/mark-down-editor";

export default function EditLessonHome() {
  const currentType = useSelector(
    (state: any) => state.lesson.currentType
  ) as string;
  return <>{currentType === "texte" ? <MarkDownEditor /> : null}</>;
}
