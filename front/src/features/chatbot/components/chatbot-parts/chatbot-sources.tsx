import { BookOpen, ExternalLink } from "lucide-react";
import { Link } from "react-router";
import type { ChatbotSource } from "../../interfaces/chatbot";

type Props = {
  sources: ChatbotSource[];
  /** Premier segment de l'URL de l'application (`admin` ou `student`). */
  routeRoot: string;
  onNavigate: () => void;
};

export default function ChatbotSources({ sources, routeRoot, onNavigate }: Props) {
  return (
    <div className="mt-2 pt-2 border-t border-base-content/10 text-xs">
      <span className="font-semibold mb-1.5 opacity-70 flex items-center gap-1">
        <BookOpen className="w-3 h-3" /> Contenus de cours associés :
      </span>
      <div className="flex flex-wrap gap-1.5">
        {sources.map((src) => (
          <Link
            key={src.activity}
            to={`/${routeRoot}/parcours/module/${src.moduleId}`}
            onClick={onNavigate}
            state={{ lessonId: src.lessonId, activityId: src.activityId }}
            className="badge badge-sm badge-outline hover:badge-primary transition-all duration-200 py-2.5 px-2 flex items-center gap-1 group no-underline"
          >
            <span className="truncate max-w-35 font-medium text-base-content">
              {src.heading_path || src.section}
            </span>
            <ExternalLink className="w-2.5 h-2.5 opacity-50 group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  );
}
