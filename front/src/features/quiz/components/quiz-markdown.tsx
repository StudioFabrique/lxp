import ReactMarkdown from "react-markdown";
import { formatQuizExplanation } from "../utils/format-quiz-explanation";
import { cn } from "../../../utils/cn";

interface Props {
  children: string;
  explanation?: boolean;
}

/**
 * Rendu markdown léger pour les explications de quiz.
 * Conçu pour fonctionner sur n'importe quel fond (alert success/error, fond neutre…)
 * sans imposer de couleur de texte — hérite toujours de la couleur du parent.
 */
const QuizMarkdown = ({ children, explanation = false }: Props) => (
  <div className={cn(explanation ? "space-y-2 leading-relaxed" : undefined)}>
    <ReactMarkdown
      components={{
        p: ({ children }) => <p>{children}</p>,

        // Listes
        ol: ({ children }) => (
          <ol className="list-decimal list-outside flex flex-col gap-1 pl-5">
            {children}
          </ol>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-outside flex flex-col gap-1 pl-5">
            {children}
          </ul>
        ),
        li: ({ children }) => <li className="pl-1">{children}</li>,

        // Texte en gras : hérite de la couleur courante
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),

        // Code inline : fond semi-transparent pour fonctionner sur tout fond
        code: ({ children }) => (
          <code className="font-mono text-[0.85em] bg-black/10 rounded px-1 py-0.5">
            {children}
          </code>
        ),
      }}
    >
      {explanation ? formatQuizExplanation(children) : children}
    </ReactMarkdown>
  </div>
);

export default QuizMarkdown;
