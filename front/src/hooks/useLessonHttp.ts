import { useCallback } from "react";

import useHttp from "./useHttp";

export default function useLessonHTTP() {
  const { sendRequest, error } = useHttp();

  const deleteLesson = useCallback(
    (id: number) => {
      const response = sendRequest({
        path: `/lesson/${id}`,
        method: "delete",
      });
      return response;
    },
    [sendRequest],
  );

  return { error, deleteLesson };
}
