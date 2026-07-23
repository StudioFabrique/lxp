import { Activity } from "./activity";

export type ActivityImport = Activity & {
  value?: string | Blob;
  hasError?: boolean;
};

export interface QueuedImage {
  file: File;
  blobUrl: string;
  size: "small" | "medium" | "large";
  tempId: string;
}
