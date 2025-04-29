-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "finalPath" TEXT,
ADD COLUMN     "subtitleEnd" DOUBLE PRECISION,
ADD COLUMN     "subtitlePath" TEXT,
ADD COLUMN     "subtitleStart" DOUBLE PRECISION,
ADD COLUMN     "subtitleText" TEXT;
