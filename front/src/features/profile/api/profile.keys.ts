export const profileKeys = {
  all: ["profile"] as const,
  information: () => [...profileKeys.all, "information"] as const,
  accomplishments: () => [...profileKeys.all, "accomplishments"] as const,
  companyLogo: () => [...profileKeys.all, "company-logo"] as const,
};
