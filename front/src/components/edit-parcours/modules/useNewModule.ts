import { useCallback, useEffect, useRef, useState } from "react";
import Contact from "../../../utils/interfaces/contact";
import Skill from "../../../utils/interfaces/skill";
import useHttp from "../../../hooks/use-http";
import { moduleCreateSchema } from "../../../lib/validation/parcours-edit/module-create-schema";
import { useParams } from "react-router-dom";
import useForm from "../../UI/forms/hooks/use-form";
import { scrollToTop } from "../../../helpers/scrollToTop";

// Type definition for module data structure
type ModuleData = {
  id: number;
  title: string;
  thumb?: string; // Optional base64 encoded thumbnail
};

// Type definition for parcours (learning path) with associated resources
type Parcours = {
  id: number;
  formationId: number;
  contacts: Contact[]; // Available instructors/contacts for the parcours
  bonusSkills: Skill[]; // Available bonus skills that can be earned
};

/**
 * Custom hook for managing module creation and display within a parcours
 *
 * This hook handles:
 * - Fetching and displaying modules associated with a parcours
 * - Managing form state for creating new modules
 * - Handling form validation and submission
 * - Managing selected contacts and skills for new modules
 * - File upload for module thumbnails
 * - Form reset and cancellation logic
 *
 * The hook integrates with the parcours edit workflow, allowing users to
 * create modules with metadata, associate instructors, and assign bonus skills.
 *
 * @returns Object containing state, handlers, and data for module management
 */
const useNewModule = () => {
  // Get parcours ID from URL parameters
  const { id } = useParams();

  // HTTP hook for API communication
  const { sendRequest, isLoading, error } = useHttp();

  // Form visibility state
  const [showForm, setShowForm] = useState(false);

  // Modules data for the current parcours
  const [modules, setModules] = useState<ModuleData[]>([]);

  // Parcours data with available contacts and skills
  const [parcours, setParcours] = useState<Parcours | null>(null);

  // Selected contacts for the new module being created
  const [currentContacts, setCurrentContacts] = useState<Contact[]>([]);

  // Selected skills for the new module being created
  const [currentSkills, setCurrentSkills] = useState<Skill[]>([]);

  // Uploaded file for module thumbnail
  const [file, setFile] = useState<File | null>(null);

  // Reference to the form element for scrolling behavior
  const refForm = useRef<HTMLFormElement | null>(null);

  // Form management hook with validation schema
  const { values, onChangeValue, onResetForm, errors, onValidateForm } =
    useForm({}, moduleCreateSchema);

  // Combined form data object for components
  const data = { values, onChangeValue, errors };

  /**
   * Fetches modules and parcours data from the API
   * Retrieves both the list of modules associated with the parcours
   * and the parcours metadata (contacts, skills) for form options
   */
  const getParcoursModules = useCallback(() => {
    const applyData = (data: {
      modules: ModuleData[];
      parcoursData: Parcours;
    }) => {
      console.log(data);
      setModules(data.modules);
      setParcours(data.parcoursData);
    };
    sendRequest({ path: `/modules/${id}` }, applyData);
  }, [id, sendRequest]);

  // Fetch data when component mounts or ID changes
  useEffect(() => {
    getParcoursModules();
  }, [getParcoursModules]);

  /**
   * Handles form submission for creating a new module
   *
   * Process:
   * 1. Prevents default form submission
   * 2. Validates form data using the schema
   * 3. Constructs module object with form values and associations
   * 4. Creates FormData for multipart upload (includes image file)
   * 5. Sends POST request to create the module
   * 6. Updates local state and resets form on success
   */
  const handleSubmitNewModule = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the form before submission
    const isValid = onValidateForm();
    if (!isValid) {
      return;
    }

    // Prepare form data for multipart upload
    const formData = new FormData();

    // Construct module object with all required data
    const module = {
      ...data.values,
      formationId: parcours?.formationId,
      // Ensure duration is at least 1 (fallback for invalid values)
      duration:
        +data.values.duration === 0 || isNaN(+data.values.duration)
          ? 1
          : +data.values.duration,
      // Extract IDs from selected contacts and skills
      contacts: currentContacts.map((item) => item.id),
      skills: currentSkills.map((item) => item.id),
    };

    // Append module data as JSON string
    formData.append("module", JSON.stringify(module));

    // Append image file if selected
    if (file) formData.append("image", file);

    // Success handler - updates UI and resets form state
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const applyData = (data: { data: ModuleData; message: string }) => {
      onResetForm();
      setShowForm(false);
      setCurrentContacts([]);
      setCurrentSkills([]);
      setFile(null);
      // Add the new module to the existing list
      setModules((prevModules) => [...prevModules, data.data as ModuleData]);
      // Scroll to top when form is hidden
      scrollToTop();
    };

    // Send POST request to create the module
    sendRequest(
      {
        path: "/formation/new-module",
        method: "post",
        body: formData,
      },
      applyData
    );
  };

  /**
   * Handles form cancellation
   * Resets all form state and hides the form without saving
   */
  const handleCancelForm = () => {
    setShowForm(false);
    onResetForm();
    setCurrentContacts([]);
    setCurrentSkills([]);
    setFile(null);
    // Scroll to top when form is hidden
    scrollToTop();
  };

  // Return all state and handlers for use in components
  return {
    showForm,
    setShowForm,
    modules,
    data,
    isLoading,
    refForm,
    handleSubmit: handleSubmitNewModule,
    handleCancelForm,
    currentContacts,
    setCurrentContacts,
    currentSkills,
    setCurrentSkills,
    parcours,
    setFile,
    error,
  };
};

export default useNewModule;
