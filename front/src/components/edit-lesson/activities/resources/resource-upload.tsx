/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import useUploadResources from "./useUploadResources";
import ResourceForm from "./resource-form";
import ResourcesAction from "./resource-actions";
import ResourcesList from "./resources-list";
import ElementNotFound from "../../../UI/element-not-found";
import Wrapper from "../../../UI/wrapper/wrapper.component";

type Props = {
  /** Function called to cancel the upload process */
  onCancel: (value: boolean) => void;
  /** Optional function to reset the form */
  onResetForm?: () => void;
  onSubmit?: () => void;
};

/**
 * ResourceUpload Component
 *
 * Manages the upload process for resources including file selection,
 * validation, progress tracking, and submission.
 *
 * Features:
 * - File selection and preview
 * - Drag and drop reordering
 * - Upload progress tracking
 * - Form validation
 * - Prevents accidental page navigation during upload
 *
 * @param onCancel - Function called to cancel the upload
 * @param onResetForm - Optional function to reset the form state
 */
export default function ResourceUpload({ onCancel, onSubmit }: Props) {
  // Retrieve functions and data from custom hook
  const {
    data, // Form data (values, errors, update function)
    filesList, // List of files to upload
    filesNumber, // Number of files in the list
    handleFileChange, // Handle file selection change
    handleRemoveResource, // Remove a file from the list
    handleReorder, // Update file order
    handleSubmit, // Submit the form
    isLoading, // Loading state
    resetFilesList, // Reset the files list
    uploadProgress, // Upload progress tracking
    cancelUpload, // Cancel upload function
    hasError, // Error state
  } = useUploadResources(onCancel, onSubmit);

  /**
   * Prevent user from accidentally leaving the page during upload
   * Shows a browser confirmation dialog when the user tries to navigate away
   */
  useEffect(() => {
    // Function called before the user leaves the page
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Prevent default behavior and show confirmation message
      event.preventDefault();
      // Modern browsers ignore custom messages and show their own
      // Return value triggers the browser's confirmation dialog
      return "Êtes-vous sûr de vouloir quitter ?";
    };

    // Add event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup listener when component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    // Main grid layout with 2 columns on xl screens
    <section className="grid grid-cols-1 gap-4">
      {/* Left column: form and actions */}
      <article className="flex flex-col gap-y-4">
        <Wrapper>
          <ResourceForm
            data={{
              ...data,
              errors: { name: data.errors.map((e) => e.message) },
            }}
            onFileChange={handleFileChange}
          />
          <ResourcesAction
            onCancel={onCancel}
            resetFilesList={resetFilesList}
            filesNumber={filesNumber}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            cancelUpload={cancelUpload}
            hasError={hasError}
          />
        </Wrapper>
      </article>
      {/* Right column: files list */}
      <article>
        {filesList && filesList.length !== 0 ? (
          <ResourcesList
            filesList={filesList}
            handleRemoveResource={handleRemoveResource}
            isLoading={isLoading}
            onReorder={handleReorder}
            uploadProgress={uploadProgress}
          />
        ) : (
          <div className="flex justify-center items-center h-full">
            <ElementNotFound message="Aucune ressource en attente de téléversement." />
          </div>
        )}
      </article>
    </section>
  );
}
