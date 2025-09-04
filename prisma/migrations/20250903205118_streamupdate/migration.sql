-- AlterTable
ALTER TABLE "public"."Stream" ADD COLUMN     "bigImage" TEXT NOT NULL DEFAULT 'https://muzufy.vercel.app/default-big.png',
ADD COLUMN     "smallImage" TEXT NOT NULL DEFAULT 'https://muzufy.vercel.app/default-small.png',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Unknown Title';
