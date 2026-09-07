-- Les tags historiques et ceux créés par un administrateur restent sans
-- propriétaire. Un tag créé par un formateur mémorise son identifiant MongoDB
-- afin de borner sa modification et sa suppression.
ALTER TABLE "Tag" ADD COLUMN "createdBy" TEXT;

CREATE INDEX "Tag_createdBy_idx" ON "Tag"("createdBy");
