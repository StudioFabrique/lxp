-- AlterTable
ALTER TABLE "Module" ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "thumb" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Parcours" ALTER COLUMN "startDate" SET DEFAULT DATE_TRUNC('day', NOW() + interval '1 day'),
ALTER COLUMN "endDate" SET DEFAULT DATE_TRUNC('day', NOW() + interval '2 month');
