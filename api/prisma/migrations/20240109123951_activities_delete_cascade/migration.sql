-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_authorId_fkey";

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
