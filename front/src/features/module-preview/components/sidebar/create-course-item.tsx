import { Check, Import, Plus } from "lucide-react";
import { cn } from "../../../../utils/cn";
import { Link } from "react-router";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import { motion } from "motion/react";

type CreateCourseItemProps = {
  parcoursId?: number;
  moduleId: number;
  onCreate: (title: string) => Promise<boolean>;
};

const CreateCourseItem = ({
  parcoursId,
  moduleId,
  onCreate,
}: CreateCourseItemProps) => {
  const [title, setTitle] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClickAdd = () => {
    setIsEditing(true);
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Prevent blur if clicking the check button
    if (buttonRef.current?.contains(e.relatedTarget as Node)) return;
    setIsEditing(false);
  };

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsEditing(false);
    }
    if (e.key === "Enter") {
      buttonRef.current?.click();
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) return;
    if (await onCreate(title)) {
      setTitle("");
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      window.scrollTo({
        top: inputRef.current?.offsetTop,
        behavior: "smooth",
      });
    }
  }, [isEditing]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col w-full cursor-pointer">
        <motion.div
          className={cn(
            "rounded-xl flex flex-col gap-4",
            isEditing && "bg-success",
          )}
          initial={{ scale: 0.95, padding: 0 }}
          animate={{
            scale: 1,
            padding: isEditing ? 16 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-center gap-5">
            {isEditing ? (
              <div className="w-full flex flex-col gap-4">
                <span className="flex gap-4">
                  <input
                    ref={inputRef}
                    type="text"
                    value={title}
                    onChange={handleChangeInput}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    className="input input-sm input-bordered w-full max-h-10 text-base font-semibold"
                  />
                  {title.length > 0 && (
                    <button
                      ref={buttonRef}
                      onClick={handleCreate}
                      disabled={!title.trim()}
                      className="btn btn-primary btn-sm tooltip tooltip-right"
                      data-tip="Valider"
                    >
                      <Check className="stroke-base-100 w-5 h-5" />
                    </button>
                  )}
                </span>
                <span className="text-sm font-light italic text-base-100">
                  Le cours sera ajouté directement à ce module.
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={handleClickAdd}
                  // Remplacement de w-full par flex-1
                  className="btn btn-success rounded-xl flex-1 text-base-100 flex justify-between items-center gap-2"
                >
                  Ajouter un cours
                  <Plus />
                </button>
                <Link
                  to="/admin/course/import"
                  state={{ parcoursId, moduleId }}
                  className="btn btn-primary text-base-100 shrink-0 tooltip tooltip-bottom"
                  data-tip="Importer des cours"
                >
                  <Import size={20} />
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateCourseItem;
