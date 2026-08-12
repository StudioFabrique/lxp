import { useCallback, useEffect, useState } from "react";
import Parcours from "../../../utils/interfaces/parcours";
import User from "../../../utils/interfaces/user";

export type ProgressionData = {
  id: number;
  metadataId: number;
  title: string;
  description: string;
  thumb: string;
  stats: {
    progress: number;
  };
};

const useTeacher = (studentId: string) => {
  const { sendRequest } = useHttp();
  const [student, setStudent] = useState<User | null>(null);
  const [parcours, setParcours] = useState<Parcours | null>(null);
  const [parcoursCompletion, setParcoursCompletion] = useState(0);
  const [imageUrl, setImageUrl] = useState("/images/parcours-default.webp");
  const [totaltokens, setTotalTokens] = useState(0);
  const [completionModules, setCompletionModules] = useState<
    ProgressionData[] | null
  >(null);

  /**
   * retourne les infos d'un apprenant et les infos du dernier parcours auquel il ou elle est inscrit
   */
  const getStudentData = useCallback(() => {
    const applyData = (data: {
      user: User;
      parcours: Parcours;
      parcoursCompletion: number;
      totalTokens: number;
    }) => {
      setStudent(data.user);
      setParcours(data.parcours ?? null);
      setTotalTokens(data.totalTokens ?? 0);
    };
    sendRequest(
      {
        path: `/user/data/${studentId}`,
      },
      applyData,
    );
  }, [sendRequest, studentId]);

  /**
   * retourne le temps total de connexion de l'apprenant sur l'application
   */
  const getTotalConnectionTime = useCallback((): number => {
    let total = 0;
    if (student && student.connectionInfos !== undefined) {
      student!.connectionInfos!.forEach((item) => {
        total += item.duration;
      });
    }
    return Math.ceil(total / 3600000);
  }, [student]);

  const getCompletion = useCallback(() => {
    const applyData = (data: {
      message: string;
      data: {
        result: ProgressionData[];
        parcoursCompletion: number;
      };
    }) => {
      console.log({ data });
      setCompletionModules(data.data ? data.data.result : []);
      setParcoursCompletion(data.data ? data.data.parcoursCompletion : 0);
    };
    sendRequest(
      {
        path: `/modules/progression/${studentId}`,
      },
      applyData,
    );
  }, [sendRequest, studentId]);

  useEffect(() => {
    getStudentData();
    getCompletion();
  }, [getStudentData, getCompletion]);

  useEffect(() => {
    if (parcours && parcours.image) {
      setImageUrl(`data:image/jpeg;base64,${parcours?.image}`);
    }
  }, [parcours]);

  return {
    imageUrl,
    student,
    parcours,
    parcoursCompletion,
    getTotalConnectionTime,
    totaltokens,
    completionModules,
  };
};

export default useTeacher;
