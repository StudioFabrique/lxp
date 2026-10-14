export const profileKeys = {
  all: ["profile"] as const,
  information: () => [...profileKeys.all, "information"] as const,
  accomplishments: () => [...profileKeys.all, "accomplishments"] as const,
  skills: () => [...profileKeys.all, "skills"] as const,
  instanceSettings: () => [...profileKeys.all, "instance-settings"] as const,
  instanceLogo: () => [...profileKeys.all, "instance-logo"] as const,
};
