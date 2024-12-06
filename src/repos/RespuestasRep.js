import pg from "pg";
import { DBConfig } from "./db.js";

export default class RespuestasRepo {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    async createRespuesta(userId, preguntaId, respuestaSeleccionada, esCorrecta, fechaCreacion) {
        try {
            const sql = `
                INSERT INTO respuestas (user_id, pregunta_id, respuesta_seleccionada, es_correcta, fecha_creacion)
                VALUES ($1, $2, $3, $4, $5) RETURNING *;
            `;
            const values = [userId, preguntaId, respuestaSeleccionada, esCorrecta, fechaCreacion];

            const result = await this.DBClient.query(sql, values);
            return result.rows[0];
        } catch (error) {
            console.error("Error al crear la respuesta:", error);
            throw new Error("Error al registrar la respuesta en la base de datos.");
        }
    }

    async getRespuestas(preguntaId, userId, limit = 10, offset = 0) {
        try {
            const conditions = [];
            const values = [];

            if (preguntaId) {
                conditions.push(`pregunta_id = $${conditions.length + 1}`);
                values.push(preguntaId);
            }

            if (userId) {
                conditions.push(`user_id = $${conditions.length + 1}`);
                values.push(userId);
            }

            const sql = `
                SELECT * FROM respuestas
                ${conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""}
                LIMIT $${values.length + 1} OFFSET $${values.length + 2};
            `;
            values.push(limit, offset);

            const result = await this.DBClient.query(sql, values);
            return result.rows;
        } catch (error) {
            console.error("Error al obtener respuestas:", error);
            throw new Error("Error al obtener las respuestas desde la base de datos.");
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
}
