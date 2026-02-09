-- CreateTable
CREATE TABLE "Authorization" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,

    CONSTRAINT "Authorization_pkey" PRIMARY KEY ("id")
);
