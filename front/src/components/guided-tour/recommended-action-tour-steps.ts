import type { Step } from "react-joyride";

export const getUserCreationTourSteps = (
  roleLabel: string,
  invite: boolean,
): Step[] => [
  {
    target: '[data-recommended-tour="user-form"]',
    title: `Créer un compte ${roleLabel}`,
    content:
      "Ce formulaire rassemble les informations nécessaires à la création du compte. Les champs marqués d’un astérisque sont obligatoires.",
    placement: "bottom",
  },
  {
    target: '[data-recommended-tour="user-informations"]',
    title: "Renseignez son identité",
    content:
      "Indiquez au minimum le prénom, le nom et une adresse e-mail valide. L’avatar et les autres informations pourront être ajoutés plus tard.",
    placement: "right",
  },
  {
    target: '[data-recommended-tour="user-role"]',
    title: `Rôle ${roleLabel}`,
    content: `Le rôle « ${roleLabel} » est déjà sélectionné. Il détermine les espaces et les fonctionnalités accessibles à ce compte.`,
    placement: "left",
  },
  ...(invite
    ? [
        {
          target: '[data-recommended-tour="user-invitation"]',
          title: "Envoyez l’invitation",
          content:
            "L’envoi de l’e-mail est activé. La personne recevra le lien lui permettant d’activer son compte et de choisir son mot de passe.",
          placement: "left" as const,
        },
      ]
    : []),
  {
    target: '[data-recommended-tour="user-save"]',
    title: "Créez le compte",
    content:
      "Une fois les informations vérifiées, enregistrez le compte avec ce bouton.",
    placement: "bottom",
  },
];

export const groupCreationTourSteps: Step[] = [
  {
    target: '[data-recommended-tour="group-form"]',
    title: "Créer un groupe d’apprenants",
    content:
      "Un groupe permet de réunir les apprenants qui suivront le même parcours.",
    placement: "bottom",
  },
  {
    target: '[data-recommended-tour="group-informations"]',
    title: "Identifiez le groupe",
    content:
      "Donnez au groupe un nom facile à reconnaître, puis ajoutez si besoin une description et un parcours.",
    placement: "right",
  },
  {
    target: '[data-recommended-tour="group-members"]',
    title: "Ajoutez les apprenants",
    content:
      "Sélectionnez des comptes existants, importez une liste CSV ou créez un nouvel apprenant. Cette étape peut aussi être complétée plus tard.",
    placement: "top",
  },
  {
    target: '[data-recommended-tour="group-save"]',
    title: "Enregistrez le groupe",
    content: "Validez pour créer le groupe et conserver sa composition.",
    placement: "bottom",
  },
];

export const logoTourSteps: Step[] = [
  {
    target: '[data-recommended-tour="company-logo"]',
    title: "Personnalisez votre organisme",
    content:
      "Choisissez la couleur d’arrière-plan puis ajoutez votre logo au format JPG ou PNG. La personnalisation est enregistrée automatiquement.",
    placement: "left",
  },
];

export const moduleCreationTourSteps: Step[] = [
  {
    target: '[data-onboarding="module-form"]',
    title: "Créer votre premier module",
    content:
      "Le formulaire est déjà ouvert dans un parcours qui vous est rattaché. Un module regroupe les cours d’une même séquence pédagogique.",
    placement: "top",
  },
  {
    target: '[data-onboarding="module-title-field"]',
    title: "Nommez le module",
    content:
      "Choisissez un titre clair. La description et les instructions de génération de quiz peuvent être complétées maintenant ou plus tard.",
    placement: "right",
  },
  {
    target: '[data-onboarding="module-duration-field"]',
    title: "Estimez sa durée",
    content: "Indiquez une durée supérieure à zéro, exprimée en heures.",
    placement: "right",
  },
  {
    target: '[data-recommended-tour="module-assignments"]',
    title: "Vérifiez les rattachements",
    content:
      "Associez les membres de l’équipe pédagogique concernés, dont vous-même si vous souhaitez retrouver ce module dans votre espace.",
    placement: "left",
  },
  {
    target: '[data-onboarding="module-save"]',
    title: "Enregistrez le module",
    content:
      "Le titre et la durée suffisent pour démarrer. Une image sera générée automatiquement si vous n’en ajoutez pas.",
    placement: "top",
  },
];
