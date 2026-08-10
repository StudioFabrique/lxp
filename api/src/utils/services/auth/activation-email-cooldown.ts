export const ACTIVATION_EMAIL_COOLDOWN_MS = 5 * 60 * 1000;

export function getActivationEmailRetryAfterSeconds(
  lastSentAt?: Date,
  now = new Date(),
) {
  if (!lastSentAt) return 0;

  const remainingMilliseconds =
    lastSentAt.getTime() + ACTIVATION_EMAIL_COOLDOWN_MS - now.getTime();

  return Math.max(0, Math.ceil(remainingMilliseconds / 1000));
}
