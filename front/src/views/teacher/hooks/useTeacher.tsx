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
    const applyData = (datas: { user: User; parcours: Parcours }) => {
      const today = new Date().getDate();
      const now = new Date().getTime();
      let data = Array<{ lastConnection: string; duration: number }>();
      if (datas.user && datas.user.connectionInfos !== undefined) {
        for (let i = datas.user?.connectionInfos!.length - 1; i >= 0; i--) {
          if (
            new Date(datas.user.connectionInfos[i].lastConnection).getDate() ===
            today - i
          ) {
            data = [
              ...data,
              {
                ...datas.user.connectionInfos[i],
                lastConnection: datas.user.connectionInfos[i].lastConnection,
                duration: datas.user.connectionInfos[i].duration,
              },
            ];
          } else {
            const tmp = new Date(now - i * 3600000 * 24);
            data = [...data, { lastConnection: tmp.toString(), duration: 0 }];
          }
        }
      }
      setStudent({ ...datas.user, connectionInfos: data });
      setParcours(datas.parcours);
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

  return {
    student,
    parcours,
    getTotalConnectionTime,
  };
};

export default useTeacher;
