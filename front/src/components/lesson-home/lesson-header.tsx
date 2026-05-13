/**
 * LessonHeader - A component that renders the header section for the lessons list page
 *
 * This component displays a header with a title, description, and action button
 * to create a new lesson.
 *
 * @example
 * ```tsx
 * <LessonHeader />
 * ```
 */
import { Link } from "react-router";
import Header from "../UI/header";
import { PlusCircle } from "lucide-react";

function LessonHeader() {
  return (
    <section className="w-full">
      {/* Main header component with title and description */}
      <Header
        title="Liste des leçons"
        description="Gérer toutes les leçons qui vous sont attribuées."
      >
        {/* Create new lesson button that navigates to creation page */}
        <Link className="btn btn-primary btn-soft" to="add">
          <PlusCircle /> Créer une leçon
        </Link>
      </Header>
    </section>
  );
}

export default LessonHeader;
