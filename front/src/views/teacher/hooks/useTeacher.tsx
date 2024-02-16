import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import Parcours from "../../../utils/interfaces/parcours";
import User from "../../../utils/interfaces/user";

const useTeacher = (studentId: string) => {
  const { sendRequest } = useHttp();
  const [student, setStudent] = useState<User | null>(null);
  const [parcours, setParcours] = useState<Parcours | null>(null);
  const [parcoursCompletion, setParcoursCompletion] = useState(0);
  const [imageUrl, setImageUrl] = useState("/images/parcours-default.webp");


  /**
   * retourne les infos d'un apprenant et les infos du dernier parcours auquel il ou elle est inscrit
   */
  const getStudentData = useCallback(() => {
    const applyData = (data: {
      user: User;
      parcours: Parcours;
      parcoursCoompletion: number;
    }) => {
      setStudent(data.user);
      setParcours(data.parcours ?? null);
      setParcoursCompletion(data.parcoursCoompletion ?? 0);
    };
    sendRequest(
      {
        path: `/user/data/${studentId}`,
      },
      applyData
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

  useEffect(() => {
    getStudentData();
  }, [getStudentData]);

  useEffect(() => {
    if (parcours && parcours.image) {
      setImageUrl(`data:image/jpeg;base64,${parcours?.image}`);
    }
  }, [parcours]);

  return {
    imageUrl,
    student,
    parcours,
    image,
    parcoursCompletion,
    getTotalConnectionTime,
  };
};

export default useTeacher;
