import {
  FC,
  Ref,
  useCallback,
  useEffect,
  useState,
} from "react";
import Info from "./info";
import Presentation from "./presentation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { informationSchema } from "../../../features/profile/schemas/info-schema";
import apiClient from "../../../lib/axios";
import Loader from "../../loaders/Loader";
import Hobby from "../../../utils/interfaces/hobby";
import { Link } from "../../../utils/interfaces/link";

import ThemeSelectSettings from "./theme-select-settings";
import ItemsAdder from "../../UI/items-adder";
import {
  transformLink,
  urlIsValid,
} from "../../../utils/helpers/link-transform";
import {
  TEST_ID_HOBBIES,
  TEST_ID_LINKS,
} from "../../../config/tests-config/tests-ids";
import { regexGeneric } from "../../../config/constantes";

type UserInformation = {
  _id: string;
  firstname: string;
  lastname: string;
  nickname?: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  description: string;
  hobbies?: Hobby[];
  links?: Link[];
};

const InformationAndSettings: FC<{
  formRef: Ref<HTMLFormElement>;
  style?: { showStudentElements?: boolean };
}> = ({ formRef, style }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(informationSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      nickname: "",
      email: "",
      address: "",
      city: "",
      postCode: "",
      phoneNumber: "",
      description: "",
    },
  });

  const [userData, setUserData] = useState<UserInformation>();
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  const [temporaryAvatar, setTemporaryAvatar] = useState<{
    file: File | null;
    url: string | null;
  }>({
    file: null,
    url: null,
  });
  const addHobby = useCallback(async (value: string) => {
    setHobbies((prev) => [...prev, { title: value }]);
    return true;
  }, []);

  const deleteHobby = useCallback(async (item: Hobby) => {
    setHobbies((prev) => prev.filter((h) => h.title !== item.title));
    return true;
  }, []);

  const addLink = useCallback(async (value: string) => {
    setLinks((links) => [...links, { ...transformLink(value) }]);
    return true;
  }, []);

  const deleteLink = useCallback(async (item: Link) => {
    setLinks((prev) => prev.filter((link) => link.url !== item.url));
    return true;
  }, []);

  const onSubmit = (data: Record<string, any>) => {
    const completeData = {
      ...data,
      email: userData?.email ?? data.email,
      hobbies,
      links,
    };

    const formData = new FormData();
    if (temporaryAvatar.file) formData.append("image", temporaryAvatar.file);
    formData.append("data", JSON.stringify({ user: completeData }));

    apiClient
      .put("/user/profile/information", formData)
      .then(() => {
        toast.success("Profil sauvegardé avec succès !");
      })
      .catch((err) => {
        const errorMessage =
          err?.response?.data?.message ?? "Erreur inconnue";
        toast.error(errorMessage);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get("/user/profile/information")
      .then((response) => setUserData(response.data.data))
      .catch((err) => {
        const errorMessage =
          err?.response?.data?.message ?? "Erreur inconnue";
        toast.error(errorMessage);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (userData) {
      reset(userData);
      setHobbies(userData.hobbies ?? []);
      setLinks(userData.links ?? []);
    }
  }, [userData, reset]);

  if (isLoading) return <Loader />;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit, (errs) => {
        const firstError = Object.values(errs)[0];
        if (firstError?.message) toast.error(firstError.message);
      })}
      className="flex flex-col gap-5"
    >
      {/* Colonne gauche — Infos du profil */}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col">
            <Info
              formProps={{ register, errors }}
              temporaryAvatar={temporaryAvatar}
              setTemporaryAvatar={setTemporaryAvatar}
            />
          </div>
          <div className="flex flex-col gap-5">
            <Presentation formProps={{ register, errors }} />
            {style?.showStudentElements && (
              <>
                {/* Hobbies */}
                <ItemsAdder
                  testId={TEST_ID_HOBBIES}
                  styleOptions={{
                    label: "Centre d'intérêts",
                    placeholder: "Ajouter un nouveau centre d'intérêt",
                    itemsHasColor: true,
                  }}
                  items={hobbies ?? []}
                  getValue={(item) => item.title}
                  onValidate={(value) => {
                    if (!(value.length > 0))
                      throw new Error("Le centre d'intérêt est vide");
                    if (hobbies.some((hobby) => hobby.title === value))
                      throw new Error(
                        `Le centre d'intérêt '${value}' existe déjà`,
                      );
                    if (!regexGeneric.test(value))
                      throw new Error("La valeur est incorrecte");
                  }}
                  onAddItem={addHobby}
                  onDelete={deleteHobby}
                />
                {/* Links */}
                <ItemsAdder
                  testId={TEST_ID_LINKS}
                  styleOptions={{
                    label: "Liens",
                    placeholder:
                      "Ajouter de nouveaux liens vers les réseaux sociaux, sites web...",
                    itemsHasColor: true,
                  }}
                  items={links || []}
                  getValue={(item) => item.url}
                  onValidate={(value) => {
                    if (!(value.length > 0)) throw new Error("L'url est vide");
                    if (links.some((link) => link.url === value))
                      throw new Error(`L'url '${value}' existe déjà`);
                    if (!urlIsValid(value))
                      throw new Error("L'url est incorrecte");
                  }}
                  onAddItem={addLink}
                  onDelete={deleteLink}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Colonne droite — Thèmes & préférences */}
      <ThemeSelectSettings />
    </form>
  );
};

export default InformationAndSettings;
