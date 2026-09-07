export default interface Tag {
  id: number;
  name: string;
  color: string;
  /** Droit de retirer cette association dans le parcours courant. */
  canUnassign?: boolean;
}
