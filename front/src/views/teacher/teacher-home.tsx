import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Context } from "../../store/context.store";
import { Socket } from "socket.io-client";

export default function TeacherHome() {
  const { socket } = useContext(Context);
  const [count, setCount] = useState(0);

  const mySocket: Socket = useMemo(() => {
    return socket;
  }, [socket]);

  const countMessage =
    count < 2 ? "apprenant connecté." : "apprenants connectés.";

  const getStudentsCount = useCallback(() => {
    if (mySocket) {
      mySocket.emit("students-count");
    }
  }, [mySocket]);

  useEffect(() => {
    getStudentsCount();
    if (mySocket) {
      mySocket.on("students-count", (count: number) => setCount(count));
    }
  }, [getStudentsCount, mySocket]);

  console.log({ count });

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2l font-bold">Teacher Home Page</h1>
      <p className="flex-1 items-center">
        {count} {countMessage}
      </p>
    </div>
  );
}
