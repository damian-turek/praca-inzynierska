-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ReportStatus" ADD VALUE 'ACCEPTED';
ALTER TYPE "ReportStatus" ADD VALUE 'REJECTED';
ALTER TYPE "ReportStatus" ADD VALUE 'COMPLETED';

-- AlterTable
ALTER TABLE "ProblemReport" ADD COLUMN     "accepted_at" TIMESTAMP(3),
ADD COLUMN     "closed_at" TIMESTAMP(3),
ADD COLUMN     "rejection_reason" TEXT;
