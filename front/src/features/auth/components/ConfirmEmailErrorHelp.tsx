import { getConfirmEmailErrorHelp } from "../confirm-email-error";

type Props = {
  message: string;
};

/** Explication et solutions, dites par le chatbot d'accueil. */
export default function ConfirmEmailErrorHelp({ message }: Props) {
  const { cause, solutions } = getConfirmEmailErrorHelp(message);

  return (
    <>
      <p>{cause}</p>
      <p className="mt-2 font-semibold">Que faire ?</p>
      <ul className="list-disc pl-5">
        {solutions.map((solution) => (
          <li key={solution}>{solution}</li>
        ))}
      </ul>
    </>
  );
}
