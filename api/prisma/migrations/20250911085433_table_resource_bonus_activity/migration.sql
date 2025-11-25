-- CreateTable
CREATE TABLE "ResourceBonusActivity" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "bonusActivityId" INTEGER NOT NULL,

    CONSTRAINT "ResourceBonusActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResourceBonusActivity" ADD CONSTRAINT "ResourceBonusActivity_bonusActivityId_fkey" FOREIGN KEY ("bonusActivityId") REFERENCES "BonusActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
