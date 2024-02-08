import { useCallback, useEffect, useState } from "react";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import FormationAddForm from "../../components/formation-home/formation-add-form";
import Tag from "../../utils/interfaces/tag";
import useHttp from "../../hooks/use-http";
import toast from "react-hot-toast";
import FormationsList from "../../components/formation-home/formations-list";
import { sortArray } from "../../utils/sortArray";

type FormationItem = {
  id: number;
  title: string;
  description?: string;
  code: string;
  level: string;
  parcours: number;
  tags?: number[];
};

export default function FormationAdd() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [formationsList, setFormationsList] = useState<FormationItem[]>([]);
  const { sendRequest, error } = useHttp();
  const [submitting, setSubmitting] = useState(false);
  const [formationToEdit, setFormationToEdit] = useState<FormationItem | null>(
    null
  );

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

  const handleSelectFormation = (id: number) => {
    const formation = formationsList.find((item) => item.id === id);
    if (formation) {
      setFormationToEdit(formation);
    }
  };

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
    code: string,
    level: string,
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
      setSubmitting(false);
    };
    setSubmitting(true);
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

  const handleUpdate = (
    title: string,
    description: string,
    code: string,
    level: string,
    tags: Tag[]
  ) => {
    const applyData = (data: {
      success: boolean;
      message: string;
      response: FormationItem;
    }) => {
      if (data.success) {
        toast.success(data.message);
        let updatedList = formationsList.filter(
          (item) => item.id !== formationToEdit!.id
        );
        updatedList = sortArray([...updatedList, data.response], "id", false);
        setFormationsList(updatedList);
      }
      setSubmitting(false);
    };
    setSubmitting(true);
    sendRequest(
      {
        path: `/formation/${formationToEdit!.id}`,
        method: "put",
        body: {
          formation: {
            title,
            description,
            code,
            level,
            tags: tags.map((item) => item.id),
          },
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

  const handleCancel = () => {
    setFormationToEdit(null);
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
    setSubmitting(false);
  }, [error]);

  return (
    <main className="flex flex-col gap-2 mt-4">
      <section>
        <h1 className="pl-4 text-2xl font-extrabold">
          {formationToEdit
            ? "Mise à jour de la formation"
            : "Création de formation"}
        </h1>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-2 ">
        <article className="p-4 h-fit">
          <Wrapper>
            {formationToEdit ? (
              <FormationAddForm
                formation={formationToEdit}
                initialTags={tags}
                onSubmit={handleUpdate}
                onNewTags={handleNewTags}
                submitting={submitting}
                onCancel={handleCancel}
              />
            ) : (
              <FormationAddForm
                initialTags={tags}
                onSubmit={handleSubmit}
                onNewTags={handleNewTags}
                submitting={submitting}
              />
            )}
          </Wrapper>
        </article>
        <article>
          <FormationsList
            formationsList={formationsList}
            onSelect={handleSelectFormation}
          />
        </article>
      </section>
    </main>
  );
}
