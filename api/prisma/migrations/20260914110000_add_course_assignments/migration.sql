-- CreateTable
CREATE TABLE "CourseAssignment" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "maxScore" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "rubricVisible" BOOLEAN NOT NULL DEFAULT true,
    "instructions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CourseAssignment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseAssignmentCriterion" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "CourseAssignmentCriterion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseAssignmentFile" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "originalName" TEXT NOT NULL,
    "storedName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CourseAssignmentFile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AssignmentSubmission" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "text" TEXT,
    "submittedAt" TIMESTAMP(3),
    "grade" DOUBLE PRECISION,
    "feedback" TEXT,
    "gradedAt" TIMESTAMP(3),
    "gradedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AssignmentSubmission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AssignmentSubmissionFile" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "originalName" TEXT NOT NULL,
    "storedName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AssignmentSubmissionFile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AssignmentCriterionScore" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "criterionId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    CONSTRAINT "AssignmentCriterionScore_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CourseAssignment_courseId_key" ON "CourseAssignment"("courseId");
CREATE INDEX "CourseAssignmentCriterion_assignmentId_order_idx" ON "CourseAssignmentCriterion"("assignmentId", "order");
CREATE UNIQUE INDEX "CourseAssignmentFile_storedName_key" ON "CourseAssignmentFile"("storedName");
CREATE INDEX "CourseAssignmentFile_assignmentId_idx" ON "CourseAssignmentFile"("assignmentId");
CREATE UNIQUE INDEX "AssignmentSubmission_assignmentId_studentId_key" ON "AssignmentSubmission"("assignmentId", "studentId");
CREATE INDEX "AssignmentSubmission_studentId_submittedAt_idx" ON "AssignmentSubmission"("studentId", "submittedAt");
CREATE UNIQUE INDEX "AssignmentSubmissionFile_storedName_key" ON "AssignmentSubmissionFile"("storedName");
CREATE INDEX "AssignmentSubmissionFile_submissionId_idx" ON "AssignmentSubmissionFile"("submissionId");
CREATE UNIQUE INDEX "AssignmentCriterionScore_submissionId_criterionId_key" ON "AssignmentCriterionScore"("submissionId", "criterionId");

ALTER TABLE "CourseAssignment" ADD CONSTRAINT "CourseAssignment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseAssignmentCriterion" ADD CONSTRAINT "CourseAssignmentCriterion_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "CourseAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseAssignmentFile" ADD CONSTRAINT "CourseAssignmentFile_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "CourseAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "CourseAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssignmentSubmissionFile" ADD CONSTRAINT "AssignmentSubmissionFile_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "AssignmentSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssignmentCriterionScore" ADD CONSTRAINT "AssignmentCriterionScore_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "AssignmentSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssignmentCriterionScore" ADD CONSTRAINT "AssignmentCriterionScore_criterionId_fkey" FOREIGN KEY ("criterionId") REFERENCES "CourseAssignmentCriterion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
