import { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";

// type de données pour les listes
type Item = {
  id: number;
  title: string;
};

const useAddLesson = () => {
  const { sendRequest } = useHttp();
  const [parcoursList, setParcoursList] = useState<Item[]>([]);
  const [parcoursId, setParcoursId] = useState<number | null>(null);
  const [modulesList, setModulesList] = useState<Item[]>([]);
  const [moduleId, setModuleId] = useState<number | null>(null);
  const [courseList, setCourseList] = useState<Item[]>([]);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    sendRequest({ path: "/parcours/select" }, (data: Item[]) => {
      setParcoursList(data);
    });
  }, [sendRequest]);

  useEffect(() => {
    if (parcoursId) {
      sendRequest({ path: `/modules/${parcoursId}` }, (data: Item[]) => {
        setModulesList(data);
      });
    }
  }, [parcoursId, sendRequest]);

  useEffect(() => {
    if (moduleId) {
      sendRequest({ path: `/course/select/${moduleId}` }, (data: Item[]) => {
        setCourseList(data);
      });
    }
  }, [moduleId, sendRequest]);

  return {
    parcoursList,
    parcoursId,
    modulesList,
    moduleId,
    courseList,
    courseId,
    isLoading,
    setParcoursId,
    setModuleId,
    setCourseId,
  };
};

export default useAddLesson;
