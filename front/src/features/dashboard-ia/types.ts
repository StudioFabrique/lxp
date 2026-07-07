export type GroupsStats = {
  _id: string;
  totalTokens: number;
  totalPrompts: number;
  averageTokensPerPrompt: number;
  groupName: string;
};

export type TopUser = {
  _id: string;
  name: string;
  totalTokens: number;
  groupName: string | null;
  lastActivity: string;
  role: string;
};
