CREATE TABLE "ContentReadCredit" (
    "id" SERIAL PRIMARY KEY,
    "studentId" INTEGER NOT NULL REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "type" TEXT NOT NULL,
    "contentId" INTEGER NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ContentReadCredit_interval_check" CHECK ("to" > "from")
);
CREATE INDEX "ContentReadCredit_studentId_type_to_idx" ON "ContentReadCredit"("studentId", "type", "to");
