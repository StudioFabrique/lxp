-- AlterTable
ALTER TABLE "Parcours" ALTER COLUMN "startDate" SET DEFAULT NOW() + interval '1 day',
ALTER COLUMN "endDate" SET DEFAULT NOW() + interval '2 month';
