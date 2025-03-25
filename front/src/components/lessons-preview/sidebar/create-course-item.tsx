import { Check, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";

type CreateCourseItemProps = { parcoursId: number; moduleId: number };

const CreateCourseItem = ({ moduleId, parcoursId }: CreateCourseItemProps) => {
  const navigate = useNavigate();
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

  const handleClickNavigate = () => {
    navigate("/admin/course/add", {
      state: { parcoursId, moduleId, courseTitle: title },
    });
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col w-full cursor-pointer">
        <motion.div
          className="bg-secondary/80 rounded-xl flex flex-col gap-4"
          initial={{ scale: 0.95, padding: 0 }}
          animate={{
            scale: 1,
            padding: isEditing ? 16 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-center gap-5">
            {isEditing ? (
              <>
                <input
                  ref={inputRef}
                  type="text"
                  value={title}
                  onChange={handleChangeInput}
                  onBlur={handleInputBlur}
                  onKeyDown={handleKeyDown}
                  className="input input-sm input-bordered w-[80%] max-h-10 text-base font-semibold"
                />
                <button
                  ref={buttonRef}
                  onClick={handleClickNavigate}
                  className="btn btn-primary btn-sm tooltip tooltip-right"
                  data-tip="Valider"
                >
                  <Check className="stroke-base-100 w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={handleClickAdd}
                className="btn btn-primary rounded-xl text-base-100 w-full flex justify-between items-center gap-2"
              >
                Ajouter un cours
                <Plus />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateCourseItem;
