import { z } from "zod";

export const authPresentationStateSchema = z.object({
  channel: z.literal("andria-auth-presentation"),
  state: z.enum(["ready", "playing", "outro", "ending", "paused", "ended", "reversed", "error"]),
});

export type AuthPresentationState = z.infer<typeof authPresentationStateSchema>["state"];
