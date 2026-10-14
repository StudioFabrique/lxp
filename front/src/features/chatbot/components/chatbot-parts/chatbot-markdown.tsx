import ReactMarkdown from "react-markdown";

type Props = { children: string };

/** Réponse de l'assistant virtuel en Markdown ; les liens externes s'ouvrent dans un nouvel onglet. */
export default function ChatbotMarkdown({ children }: Props) {
  return (
    <ReactMarkdown
      components={{
        a: ({ children: label, ...props }) => (
          <a
            {...props}
            {...(props.href?.includes("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {label}
          </a>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
