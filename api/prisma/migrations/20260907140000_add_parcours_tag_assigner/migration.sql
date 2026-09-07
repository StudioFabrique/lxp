-- Les associations historiques ou créées par un administrateur restent sans
-- propriétaire. Une association créée par un formateur mémorise son
-- identifiant MongoDB afin que lui seul puisse la retirer du parcours.
ALTER TABLE "TagsOnParcours" ADD COLUMN "addedBy" TEXT;

CREATE INDEX "TagsOnParcours_addedBy_idx" ON "TagsOnParcours"("addedBy");
