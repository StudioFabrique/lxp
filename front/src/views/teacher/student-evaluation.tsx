import { useCallback, useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";

type Parcours = {
  id: number;
  title: string;
};

export default function StudentEvaluationView() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [parcoursList, setParcoursList] = useState<Parcours[]>([]);

  const handleClick = () => {
    if (!isFlipped) setIsFlipped(true);
  };

  const { sendRequest } = useHttp();

  // retourne les deux parcours auquel l'utilisateur est associé en tant que contact
  const getParcours = useCallback(() => {
    const applyData = (data: { success: boolean; data: Parcours[] }) => {
      if (data.success) setParcoursList(data.data);
    };
    sendRequest(
      {
        path: "/evaluation/parcours",
      },
      applyData,
    );
  }, [sendRequest]);

  const getGroups = () => {};

  const getStudents = () => {};

  const handleParcoursChange = (event: any) => {
    console.log(event.currentTarget.value);
    getGroups();
  };

  useEffect(() => {
    getParcours();
  }, [getParcours]);

  return (
    <main>
      <h1>Evaluations</h1>
      <form>
        <select className="select" onChange={(e) => handleParcoursChange(e)}>
          <option value="">Parcours</option>
          {parcoursList.length > 0
            ? parcoursList.map((item) => (
                <option key={item.id} value={item.title}>
                  {item.title}
                </option>
              ))
            : null}
        </select>
      </form>
      <div className="w-64 h-64 [perspective:1000px]">
        <div
          className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
          onClick={handleClick}
        >
          <div className="absolute w-full h-full bg-blue-500 text-white flex items-center justify-center [backface-visibility:hidden]">
            list groupes
          </div>
          <div className="absolute w-full h-full bg-green-500 text-white flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
            list users
          </div>
        </div>
      </div>
      <div className="form-control">
        <label htmlFor="type">
          <input type="radio" name="radio-type" value="module" />
          Module
        </label>
        <label htmlFor="type">
          <input type="radio" name="radio-type" value="module" />
          Cours
        </label>
        <label htmlFor="type">
          <input type="radio" name="radio-type" value="module" />
          Leçon
        </label>
        <label htmlFor="type">
          <input type="radio" name="radio-type" value="module" />
          Activité
        </label>
      </div>
      <textarea placeholder="commentaires" />
      <div>
        <button className="btn btn-primary">enregistrer</button>
      </div>
    </main>
  );
}
