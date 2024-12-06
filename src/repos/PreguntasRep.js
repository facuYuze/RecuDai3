import pg from "pg";
import { DBConfig } from "./db.js";

export default class preguntasRepo {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    async createPregunta(Pregunta, fechaCreacion) {
        const sql = `
            INSERT INTO preguntas (pregunta, opcion1, opcion2, opcion3, opcion4, respuesta_correcta, fecha_creacion)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
        `;
        const values = [
            Pregunta.pregunta,
            Pregunta.opcion1,
            Pregunta.opcion2,
            Pregunta.opcion3,
            Pregunta.opcion4,
            Pregunta.respuestaCorrecta,
            fechaCreacion,
        ];
        try {
            const result = await this.DBClient.query(sql, values);
            return result.rows[0];
        } catch (error) {
            console.error("Error al crear la pregunta:", error);
            throw new Error("Error al insertar la pregunta en la base de datos.");
        }
    }

    async disconnect() {
        try {
            await this.DBClient.end();
            console.log("Conexión cerrada correctamente.");
        } catch (error) {
            console.error("Error al cerrar la conexión:", error);
        }
    }

    // Resto de métodos...
}
