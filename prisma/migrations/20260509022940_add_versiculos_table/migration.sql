/*
  Warnings:

  - You are about to drop the column `orden` on the `opciones` table. All the data in the column will be lost.
  - Added the required column `orden_opcion` to the `opciones` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "opciones" DROP COLUMN "orden",
ADD COLUMN     "orden_opcion" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "versiculos" (
    "id" SERIAL NOT NULL,
    "texto" TEXT NOT NULL,
    "referencia" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "versiculos_pkey" PRIMARY KEY ("id")
);
