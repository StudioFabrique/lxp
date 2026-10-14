import { Download, LoaderCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { modulePreviewApi } from "../../api/module-preview.api";
import type { AssignmentFile } from "../../interfaces/assignment";

function fileSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} Ko`;
  return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
}

export function AssignmentFileButton({
  courseId,
  kind,
  file,
}: {
  courseId: number;
  kind: "brief" | "submission";
  file: AssignmentFile;
}) {
  const [loading, setLoading] = useState(false);
  const download = async () => {
    setLoading(true);
    try {
      const blob = await modulePreviewApi.mutations.downloadAssignmentFile(
        courseId,
        kind,
        file.id,
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.originalName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Impossible de télécharger ce fichier.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="btn btn-sm btn-outline max-w-full justify-start"
      onClick={download}
      disabled={loading}
    >
      {loading ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      <span className="truncate">{file.originalName}</span>
      <span className="text-xs opacity-60">{fileSize(file.size)}</span>
    </button>
  );
}
