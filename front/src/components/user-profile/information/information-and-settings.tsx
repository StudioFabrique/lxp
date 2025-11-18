import {
  FC,
  FormEventHandler,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Info from "./info";
import Presentation from "./presentation";
import useForm from "../../UI/forms/hooks/use-form";
import { validationErrors } from "../../../helpers/validate";
import toast from "react-hot-toast";
import { informationSchema } from "../../../lib/validation/profile/info-schema";
import useHttp from "../../../hooks/use-http";
import Loader from "../../UI/loader";
import Hobby from "../../../utils/interfaces/hobby";
import { Link } from "../../../utils/interfaces/link";

import ThemeSelectSettings from "./theme-select-settings";
import ItemsAdder from "../../UI/items-adder";
import { regexGeneric } from "../../../utils/constantes";
import {
  transformLink,
  urlIsValid,
} from "../../../utils/link-transform-service";
import {
  TEST_ID_HOBBIES,
  TEST_ID_LINKS,
} from "../../../config/tests-config/tests-ids";

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
  const { sendRequest, isLoading } = useHttp(true);

  const { initValues, onValidationErrors, ...formProps } = useForm();

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
  const firstInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmitForm: FormEventHandler = (e) => {
    e.preventDefault();

    const completeData = {
      ...formProps.values,
      hobbies,
      links,
    };

    const formData = new FormData();
    if (temporaryAvatar.file) formData.append("image", temporaryAvatar.file);
    formData.append("data", JSON.stringify({ user: completeData }));

    try {
      informationSchema.parse(completeData);
      sendRequest(
        { path: "/user/profile/information", method: "put", body: formData },
        () => {
          toast.success("Profil sauvegardé avec succès !");
        }
      );
    } catch (error) {
      const errs = validationErrors(error);
      toast.error(errs[0].message);
      onValidationErrors(errs);
    }
  };

  useEffect(() => {
    sendRequest(
      { path: "/user/profile/information" },
      (data: { data: UserInformation }) => setUserData(data.data)
    );
  }, [sendRequest]);

  useEffect(() => {
    if (userData) {
      initValues(userData);
      setHobbies(userData.hobbies ?? []);
      setLinks(userData.links ?? []);
    }
  }, [userData, initValues]);

  if (isLoading) return <Loader />;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmitForm}
      className="flex flex-col gap-5"
    >
      {/* Colonne gauche — Infos du profil */}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col">
            <Info
              formProps={formProps}
              firstInputRef={firstInputRef}
              temporaryAvatar={temporaryAvatar}
              setTemporaryAvatar={setTemporaryAvatar}
            />
          </div>
          <div className="flex flex-col gap-5">
            <Presentation formProps={formProps} />
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
                        `Le centre d'intérêt '${value}' existe déjà`
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
