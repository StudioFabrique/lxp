-- CreateTable
CREATE TABLE "Formation" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "Formation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parcours" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "degree" TEXT,
    "image" BYTEA,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminId" INTEGER NOT NULL,
    "formationId" INTEGER NOT NULL,

    CONSTRAINT "Parcours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" BYTEA NOT NULL,
    "duration" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "idMdb" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "idMdb" TEXT NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "idMdb" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Objective" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Objective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjectivesOnParcours" (
    "objectiveId" INTEGER NOT NULL,
    "parcoursId" INTEGER NOT NULL,

    CONSTRAINT "ObjectivesOnParcours_pkey" PRIMARY KEY ("objectiveId","parcoursId")
);

-- CreateTable
CREATE TABLE "SKillsOnParcours" (
    "skillId" INTEGER NOT NULL,
    "parcoursId" INTEGER NOT NULL,

    CONSTRAINT "SKillsOnParcours_pkey" PRIMARY KEY ("skillId","parcoursId")
);

-- CreateTable
CREATE TABLE "TagsOnParcours" (
    "tagId" INTEGER NOT NULL,
    "parcoursId" INTEGER NOT NULL,

    CONSTRAINT "TagsOnParcours_pkey" PRIMARY KEY ("tagId","parcoursId")
);

-- CreateTable
CREATE TABLE "ContactsOnParcours" (
    "parcoursId" INTEGER NOT NULL,
    "contactId" INTEGER NOT NULL,

    CONSTRAINT "ContactsOnParcours_pkey" PRIMARY KEY ("parcoursId","contactId")
);

-- CreateTable
CREATE TABLE "ModulesOnParcours" (
    "moduleId" INTEGER NOT NULL,
    "parcoursId" INTEGER NOT NULL,

    CONSTRAINT "ModulesOnParcours_pkey" PRIMARY KEY ("moduleId","parcoursId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Formation_title_key" ON "Formation"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Parcours_title_key" ON "Parcours"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Module_title_key" ON "Module"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_description_key" ON "Skill"("description");

-- AddForeignKey
ALTER TABLE "Parcours" ADD CONSTRAINT "Parcours_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcours" ADD CONSTRAINT "Parcours_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectivesOnParcours" ADD CONSTRAINT "ObjectivesOnParcours_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "Objective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectivesOnParcours" ADD CONSTRAINT "ObjectivesOnParcours_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES "Parcours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SKillsOnParcours" ADD CONSTRAINT "SKillsOnParcours_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SKillsOnParcours" ADD CONSTRAINT "SKillsOnParcours_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES "Parcours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnParcours" ADD CONSTRAINT "TagsOnParcours_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnParcours" ADD CONSTRAINT "TagsOnParcours_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES "Parcours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactsOnParcours" ADD CONSTRAINT "ContactsOnParcours_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES "Parcours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactsOnParcours" ADD CONSTRAINT "ContactsOnParcours_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModulesOnParcours" ADD CONSTRAINT "ModulesOnParcours_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModulesOnParcours" ADD CONSTRAINT "ModulesOnParcours_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES "Parcours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
