import type Parcours from "../../../utils/interfaces/parcours";
import type User from "../../../utils/interfaces/user";
import type { LearningContext } from "../../learning-profile/types";

export type ProgressionData = {
  id: number;
  metadataId: number;
  title: string;
  description: string;
  thumb: string;
  stats: {
    progress: number;
  };
};

export type UserDataResponse = {
  user: User;
  parcours?: Parcours | null;
  totalTokens?: number;
  learningProfile?: {
    profile: LearningContext["profile"];
    formations: LearningContext["availableFormations"];
  } | null;
};

export type UserProgressionResponse = {
  message: string;
  data: {
    result: ProgressionData[];
    parcoursCompletion: number;
  } | null;
};
