-- AlterTable
ALTER TABLE "Parcours" ALTER COLUMN "startDate" SET DEFAULT DATE_TRUNC('day', NOW() + interval '1 day'),
ALTER COLUMN "endDate" SET DEFAULT DATE_TRUNC('day', NOW() + interval '2 month');

-- CreateTable
CREATE TABLE "Mediatheque" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mediatheque_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Mediatheque" ADD CONSTRAINT "Mediatheque_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
