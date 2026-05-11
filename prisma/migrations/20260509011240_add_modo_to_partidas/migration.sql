-- CreateTable
CREATE TABLE "jugadores" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "creado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jugadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opciones" (
    "id" SERIAL NOT NULL,
    "pregunta_id" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "es_correcta" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL,

    CONSTRAINT "opciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partidas" (
    "id" SERIAL NOT NULL,
    "jugador_id" INTEGER NOT NULL,
    "puntaje_total" INTEGER NOT NULL DEFAULT 0,
    "respuestas_correctas" INTEGER NOT NULL DEFAULT 0,
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "modo" TEXT NOT NULL DEFAULT 'trivia',

    CONSTRAINT "partidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preguntas" (
    "id" SERIAL NOT NULL,
    "texto" TEXT NOT NULL,
    "creado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "preguntas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ranking_semanal" (
    "id" SERIAL NOT NULL,
    "jugador_id" INTEGER NOT NULL,
    "puntaje_total" INTEGER NOT NULL DEFAULT 0,
    "partidas_contadas" INTEGER NOT NULL DEFAULT 0,
    "semana_inicio" DATE NOT NULL,
    "semana_fin" DATE NOT NULL,
    "actualizado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ranking_semanal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respuestas_detalle" (
    "id" SERIAL NOT NULL,
    "partida_id" INTEGER NOT NULL,
    "pregunta_id" INTEGER NOT NULL,
    "opcion_seleccionada_id" INTEGER NOT NULL,
    "tiempo_respuesta_ms" INTEGER NOT NULL,
    "puntos_obtenidos" INTEGER NOT NULL DEFAULT 0,
    "es_correcta" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "respuestas_detalle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jugadores_nombre_key" ON "jugadores"("nombre");

-- CreateIndex
CREATE INDEX "idx_opciones_pregunta" ON "opciones"("pregunta_id");

-- CreateIndex
CREATE INDEX "idx_partidas_fecha" ON "partidas"("fecha");

-- CreateIndex
CREATE INDEX "idx_partidas_jugador" ON "partidas"("jugador_id");

-- CreateIndex
CREATE INDEX "idx_ranking_semanal_puntaje" ON "ranking_semanal"("puntaje_total" DESC);

-- CreateIndex
CREATE INDEX "idx_ranking_semanal_semana" ON "ranking_semanal"("semana_inicio");

-- CreateIndex
CREATE UNIQUE INDEX "ranking_semanal_jugador_id_semana_inicio_key" ON "ranking_semanal"("jugador_id", "semana_inicio");

-- CreateIndex
CREATE INDEX "idx_respuestas_partida" ON "respuestas_detalle"("partida_id");

-- CreateIndex
CREATE UNIQUE INDEX "respuestas_detalle_partida_id_pregunta_id_key" ON "respuestas_detalle"("partida_id", "pregunta_id");

-- AddForeignKey
ALTER TABLE "opciones" ADD CONSTRAINT "opciones_pregunta_id_fkey" FOREIGN KEY ("pregunta_id") REFERENCES "preguntas"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "partidas" ADD CONSTRAINT "partidas_jugador_id_fkey" FOREIGN KEY ("jugador_id") REFERENCES "jugadores"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ranking_semanal" ADD CONSTRAINT "ranking_semanal_jugador_id_fkey" FOREIGN KEY ("jugador_id") REFERENCES "jugadores"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "respuestas_detalle" ADD CONSTRAINT "respuestas_detalle_opcion_seleccionada_id_fkey" FOREIGN KEY ("opcion_seleccionada_id") REFERENCES "opciones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "respuestas_detalle" ADD CONSTRAINT "respuestas_detalle_partida_id_fkey" FOREIGN KEY ("partida_id") REFERENCES "partidas"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "respuestas_detalle" ADD CONSTRAINT "respuestas_detalle_pregunta_id_fkey" FOREIGN KEY ("pregunta_id") REFERENCES "preguntas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
