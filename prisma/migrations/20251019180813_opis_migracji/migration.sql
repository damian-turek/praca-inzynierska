-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('ZGLOSZONE', 'PRZYJETY', 'W_TRAKCIE', 'ZREALIZOWANE', 'ODRZUCONY');

-- CreateTable
CREATE TABLE "SharedSpace" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "max_places" INTEGER NOT NULL,

    CONSTRAINT "SharedSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedSpaceReservation" (
    "id" SERIAL NOT NULL,
    "shared_space_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "places_reserved" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedSpaceReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemReport" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "status" "ReportStatus" NOT NULL DEFAULT 'ZGLOSZONE',
    "reported_by" INTEGER NOT NULL,
    "handled_by" INTEGER,

    CONSTRAINT "ProblemReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SharedSpaceReservation" ADD CONSTRAINT "SharedSpaceReservation_shared_space_id_fkey" FOREIGN KEY ("shared_space_id") REFERENCES "SharedSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedSpaceReservation" ADD CONSTRAINT "SharedSpaceReservation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemReport" ADD CONSTRAINT "ProblemReport_reported_by_fkey" FOREIGN KEY ("reported_by") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemReport" ADD CONSTRAINT "ProblemReport_handled_by_fkey" FOREIGN KEY ("handled_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
