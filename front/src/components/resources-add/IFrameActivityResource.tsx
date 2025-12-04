import { useEffect, useMemo, useState } from "react";
import { Activity } from "../../utils/interfaces/activity";
import { ActivitySelectMode } from "../../views/module-content-explorer/store/module-explorer-reducer";
import IframeActivity from "../module-content-explorer/preview/iframe-activity";
import useForm from "../UI/forms/hooks/use-form";
import Field from "../UI/forms/field";
import z from "zod";
import { regexGeneric } from "../../utils/constantes";
import cleanIframeLink from "../../utils/clean-iframe-link";

type Props = {
  mode: ActivitySelectMode;
  activity: Activity | null;
};

export default function IFrameActivityResource(props: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = useMemo(() => {
    return z.object({
      title: z
        .string({ required_error: "Le titre est requis" })
        .regex(regexGeneric, {
          message: "Le titre contient des caractères non autorisés",
        }),
    });
  }, []);

  const { values, onValidationErrors, onChangeValue, initValues, errors } =
    useForm({}, schema);

  const data = { values, onChangeValue, errors };

  const cleanedUrl = useMemo(() => {
    try {
      return src && src.length > 0 ? cleanIframeLink(src) : "";
    } catch (error) {
      setUrlError((error as Error).message);
      return "";
    }
  }, [src]);

  useEffect(() => {
    try {
      const tmp =
        (values.url as string).length > 0
          ? cleanIframeLink(values.url as string)
          : "";
      onChangeValue("url", tmp);
    } catch (error) {
      setUrlError((error as Error).message);
    }
  }, [values.url, onChangeValue]);

  console.log({ values });

  useEffect(() => {
    if (props.activity)
      initValues({ title: props.activity.title, url: props.activity.url });
  }, [props.activity, initValues]);

  if (props.mode !== "read") {
    return (
      <>
        <p>{urlError}</p>
        <form>
          <Field data={data} name="title" label="Titre" />
          <input
            className="w-full input input-bordered focus:outline-none disabled:cursor-not-allowed disabled:text-base-content/60"
            type="text"
            name="url"
            value={src ? src : ""}
            onChange={(e) => setSrc(e.target.value)}
            placeholder="URL"
          />
          {cleanedUrl ? (
            <div className="relative w-full overflow-hidden rounded-lg">
              {isLoading ? (
                <div className="w-full h-[500px] bg-base-200 flex flex-col justify-center items-center gap-3 animate-pulse">
                  <div className="skeleton w-3/4 h-6 rounded"></div>
                  <div className="skeleton w-5/6 h-6 rounded"></div>
                  <div className="skeleton w-2/3 h-6 rounded"></div>
                  <p className="text-sm text-base-content/60 mt-4">
                    Chargement de la ressource...
                  </p>
                </div>
              ) : null}

              <iframe
                src={cleanedUrl}
                title="Iframe Activity"
                className="w-full h-[500px] rounded-lg"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
                hidden={isLoading}
              />
            </div>
          ) : (
            <div className="p-6 bg-base-200 text-center rounded-lg text-base-content/70">
              <p>
                {props.mode === "write"
                  ? "Saisir une URL ci-dessus pour prévisualiser le contenu."
                  : "Aucune ressource iframe disponible."}
              </p>
            </div>
          )}
        </form>
      </>
    );
  }
}
