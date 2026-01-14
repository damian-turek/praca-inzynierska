/*
  Warnings:

  - The values [ZGLOSZONE,PRZYJETY,W_TRAKCIE,ZREALIZOWANE,ODRZUCONY,PRZYJETE,ODRZUCONE,ZAKONCZONE] on the enum `ReportStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReportStatus_new" AS ENUM ('REPORTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');
ALTER TABLE "public"."ProblemReport" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ProblemReport" ALTER COLUMN "status" TYPE "ReportStatus_new" USING ("status"::text::"ReportStatus_new");
ALTER TYPE "ReportStatus" RENAME TO "ReportStatus_old";
ALTER TYPE "ReportStatus_new" RENAME TO "ReportStatus";
DROP TYPE "public"."ReportStatus_old";
ALTER TABLE "ProblemReport" ALTER COLUMN "status" SET DEFAULT 'REPORTED';
COMMIT;

-- AlterTable
ALTER TABLE "ProblemReport" ALTER COLUMN "status" SET DEFAULT 'REPORTED';

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "residence_end" TIMESTAMP(6),
ADD COLUMN     "residence_start" TIMESTAMP(6);

-- CreateTable
CREATE TABLE "BillingDocument" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BillingDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BillingDocument" ADD CONSTRAINT "BillingDocument_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
