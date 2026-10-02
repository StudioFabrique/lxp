import { useState } from "react";
import { Plus } from "lucide-react";
import { CreateGroupModal } from "./CreateGroupModal";

export default function CreateTeacherGroup() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="btn btn-primary h-auto min-h-10 min-w-0 max-w-full shrink-0 whitespace-normal py-2"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4 shrink-0" aria-hidden="true" /> Créer un nouveau
        groupe
      </button>
      {open && <CreateGroupModal onClose={() => setOpen(false)} />}
    </>
  );
}
