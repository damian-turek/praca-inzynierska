-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "UserRequest" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "pesel" VARCHAR(11) NOT NULL,
    "first_name" TEXT NOT NULL,
    "second_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "UserRequest_pkey" PRIMARY KEY ("id")
);
