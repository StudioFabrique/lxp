import ReactMarkdown from "react-markdown";

interface Props {
  children: string;
}

/**
 * Rendu markdown léger pour les explications de quiz.
 * Conçu pour fonctionner sur n'importe quel fond (alert success/error, fond neutre…)
 * sans imposer de couleur de texte — hérite toujours de la couleur du parent.
 */
const QuizMarkdown = ({ children }: Props) => (
  <ReactMarkdown
    components={{
      // Paragraphes : pas de marge superflue à l'intérieur d'un alert
      p: ({ children }) => <span className="block">{children}</span>,

      // Listes
      ol: ({ children }) => (
        <ol className="list-decimal list-inside flex flex-col gap-0.5 mt-1">
          {children}
        </ol>
      ),
      ul: ({ children }) => (
        <ul className="list-disc list-inside flex flex-col gap-0.5 mt-1">
          {children}
        </ul>
      ),
      li: ({ children }) => <li className="block">{children}</li>,

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
    {children}
  </ReactMarkdown>
);

export default QuizMarkdown;
