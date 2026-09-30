import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Activity } from "../../../utils/interfaces/activity";
import { iframeSchema } from "../../lesson/media.schema";
import { showFormErrors } from "../../../components/form/form-errors";

export default function useResourceIFrame(activity: Activity | null, onSubmit: (values: { title: string; url: string }) => void) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({ resolver: zodResolver(iframeSchema), defaultValues: { title: activity?.title ?? "", url: activity?.url ?? "" } });
  const { register, reset, watch, setValue, formState: { errors } } = form;
  const src = watch("url");
  const preview = iframeSchema.shape.url.safeParse(src);
  useEffect(() => { reset({ title: activity?.title ?? "", url: activity?.url ?? "" }); }, [activity, reset]);
  return { data: { register, errors }, src, cleanedUrl: preview.success ? preview.data : "",
    handleUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => setValue("url", event.target.value, { shouldDirty: true, shouldValidate: true }),
    handleSubmit: form.handleSubmit(onSubmit, showFormErrors), urlError: errors.url?.message ?? null, isLoading, setIsLoading };
}
