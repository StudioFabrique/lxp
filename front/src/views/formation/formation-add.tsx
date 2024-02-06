import { useCallback, useEffect, useState } from "react";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import FormationAddForm from "../../components/admin-home/formation-home/formation-add-form";
import Tag from "../../utils/interfaces/tag";
import useHttp from "../../hooks/use-http";

export default function FormationAdd() {
  const [tags, setTags] = useState<Tag[]>([]);
  const { sendRequest, error } = useHttp();

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

  useEffect(() => {
    getTags();
    return () => setTags([]);
  }, [getTags]);

  return (
    <main className="flex flex-col gap-4 mt-4">
      <section>
        <h1 className="text-2xl font-extrabold">Création de formation</h1>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-x-16">
        <article className="p-4">
          <Wrapper>
            <FormationAddForm initialTags={tags} />
          </Wrapper>
        </article>
        <article>LISTE DES PARCOURS</article>
      </section>
    </main>
  );
}
