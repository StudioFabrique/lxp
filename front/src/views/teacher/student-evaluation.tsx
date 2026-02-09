import { useCallback, useEffect, useState } from "react";
import ElementNotFound from "../../components/UI/element-not-found";
import useHttp from "../../hooks/use-http";

export default function StudentEvaluationView() {
  const { error, isLoading, sendRequest } = useHttp();
  const [resultPg, setResultPg] = useState<any>(null);
  const [resultMongo, setResultMongo] = useState<any>(null);

  const getData = useCallback(
    (url: string) => {
      const applyData = (data: any) => {
        console.log(data);
        url === "test-pg" ? setResultPg(data) : setResultMongo(data);
      };
      sendRequest(
        {
          path: "/chatbot/" + url,
          method: "get",
        },
        applyData,
      );
    },
    [sendRequest],
  );

  useEffect(() => {
    getData("test-pg");
    getData("test-mongo");
  }, [getData]);
  return (
    <main>
      <h1>Evaluations</h1>
      {resultPg && (
        <section>
          <h2>Result PostgreSQL:</h2>
          <pre>{JSON.stringify(resultPg, null, 2)}</pre>
        </section>
      )}
      {resultMongo && (
        <section>
          <h2>Result MongoDB:</h2>
          <pre>{JSON.stringify(resultMongo, null, 2)}</pre>
        </section>
      )}
      {error && <ElementNotFound message={error} />}
    </main>
  );
}
