/*
  Warnings:

  - A unique constraint covering the columns `[jugador_id,semana_inicio,modo]` on the table `ranking_semanal` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ranking_semanal_jugador_id_semana_inicio_key";

-- AlterTable
ALTER TABLE "ranking_semanal" ADD COLUMN     "modo" TEXT NOT NULL DEFAULT 'trivia';

-- CreateIndex
CREATE INDEX "idx_ranking_semanal_modo" ON "ranking_semanal"("modo");

-- CreateIndex
CREATE UNIQUE INDEX "ranking_semanal_jugador_id_semana_inicio_modo_key" ON "ranking_semanal"("jugador_id", "semana_inicio", "modo");
