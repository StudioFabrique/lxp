import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import Parcours from "../../../utils/interfaces/parcours";
import User from "../../../utils/interfaces/user";

const useTeacher = (studentId: string) => {
  const { sendRequest } = useHttp();
  const [student, setStudent] = useState<User | null>(null);
  const [parcours, setParcours] = useState<Parcours | null>(null);

  /**
   * retourne les infos d'un apprenant et les infos du dernier parcours auquel il ou elle est inscrit
   */
  const getStudentData = useCallback(() => {
    const applyData = (data: { user: User; parcours: Parcours }) => {
      setStudent(data.user);
      setParcours(data.parcours);
    };
    sendRequest(
      {
        path: `/user/data/${studentId}`,
      },
      applyData
    );
  }, [sendRequest, studentId]);

  const getTotalConnectionTime = (): number => {
    let total = 0;
    if (student && student.connectionInfos !== undefined) {
      student!.connectionInfos!.forEach((item) => {
        total += item.duration / 3600000;
      });
    }
    return total;
  };

  useEffect(() => {
    getStudentData();
  }, [getStudentData]);

  return {
    student,
    parcours,
    getTotalConnectionTime,
  };
};

export default useTeacher;
