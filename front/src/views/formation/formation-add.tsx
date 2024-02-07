import { useCallback, useEffect, useState } from "react";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import FormationAddForm from "../../components/formation-home/formation-add-form";
import Tag from "../../utils/interfaces/tag";
import useHttp from "../../hooks/use-http";
import toast from "react-hot-toast";
import FormationsList from "../../components/formation-home/formations-list";

type FormationItem = {
  id: number;
  title: string;
  code: string;
  level: string;
  parcours: number;
};

export default function FormationAdd() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [formationsList, setFormationsList] = useState<FormationItem[]>([]);
  const { sendRequest, error } = useHttp();

  /**
   * retourne la liste des tags enregistrés dans la base de données
   */
  const getTags = useCallback(() => {
    const applyData = (data: Tag[]) => {
      setTags(data);
    };
    sendRequest(
      {
        path: "/tag",
      },
      applyData
    );
  }, [sendRequest]);

  /**
   * Enregistrement d'une nouvelle formation dans la base de données
   * @param title string
   * @param description string
   * @param level string
   * @param code string
   * @param tags Tag[]
   */
  const handleSubmit = (
    title: string,
    description: string,
    level: string,
    code: string,
    tags: Tag[]
  ) => {
    const applyData = (data: {
      success: boolean;
      message: string;
      response: FormationItem;
    }) => {
      if (data.success) {
        toast.success(data.message);
        console.log(data.response);
        setFormationsList((prevState) => [...prevState, data.response]);
      }
    };
    sendRequest(
      {
        path: "/formation",
        method: "post",
        body: {
          title,
          description,
          code,
          level,
          tags: tags.map((item) => item.id),
        },
      },
      applyData
    );
  };

  const getFormationsList = useCallback(() => {
    const applyData = (data: {
      success: boolean;
      message: string;
      response: FormationItem[];
    }) => {
      setFormationsList(data.response);
    };
    sendRequest(
      {
        path: "/formation/list",
      },
      applyData
    );
  }, [sendRequest]);

  const handleNewTags = (newTags: Tag[]) => {
    setTags((prevState) => [...prevState, ...newTags]);
  };

  // exécution des fonctions qui retournent la liste des tags et des formations au montage du composant
  useEffect(() => {
    getTags();
    getFormationsList();
    return () => {
      setTags([]);
      setFormationsList([]);
    };
  }, [getTags, getFormationsList]);

  // gestion des erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  return (
    <main className="flex flex-col gap-2 mt-4">
      <section>
        <h1 className="pl-4 text-2xl font-extrabold">Création de formation</h1>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-x-16">
        <article className="p-4">
          <Wrapper>
            <FormationAddForm
              initialTags={tags}
              onSubmit={handleSubmit}
              onNewTags={handleNewTags}
            />
          </Wrapper>
        </article>
        <article>
          <FormationsList formationsList={formationsList} />
        </article>
      </section>
    </main>
  );
}
