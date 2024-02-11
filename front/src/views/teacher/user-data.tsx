import { useParams } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import { useCallback, useEffect, useState } from "react";
import User from "../../utils/interfaces/user";

export default function UserData() {
  const { studentId } = useParams();
  const { sendRequest } = useHttp();
  const [student, setStudent] = useState<User | null>(null);

  const getStudentData = useCallback(() => {
    const applyData = (data: User) => {
      setStudent(data);
    };
    sendRequest(
      {
        path: `/user/data/${studentId}`,
      },
      applyData
    );
  }, [sendRequest, studentId]);

  useEffect(() => {
    getStudentData();
  }, [getStudentData]);

  return <div>{JSON.stringify(student)}</div>;
}
