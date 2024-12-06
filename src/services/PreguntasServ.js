import preguntasRepo from "../repos/PreguntasRep.js";
const PreguntasRepo = new preguntasRepo();

export default class PreguntaService {
    async createPregunta(Pregunta, fechaCreacion) {
        // Validación adicional si es necesario
        if (!Pregunta.pregunta || !Pregunta.opcion1 || !Pregunta.opcion2) {
            throw new Error("Pregunta y al menos dos opciones son obligatorias.");
        }

        try {
            return await PreguntasRepo.createPregunta(Pregunta, fechaCreacion);
        } catch (error) {
            console.error("Error en createPregunta:", error.message);
            throw error;
        }
    }

    async updatePregunta(id, Pregunta) {
        try {
            const preguntaExistente = await PreguntasRepo.getPreguntaById(id);
            if (!preguntaExistente) {
                throw new Error("La pregunta no existe.");
            }

            return await PreguntasRepo.updatePregunta(id, Pregunta);
        } catch (error) {
            console.error("Error en updatePregunta:", error.message);
            throw error;
        }
    }

    async getPreguntaById(id) {
        try {
            const pregunta = await PreguntasRepo.getPreguntaById(id);
            if (!pregunta) {
                throw new Error("Pregunta no encontrada.");
            }
            return pregunta;
        } catch (error) {
            console.error("Error en getPreguntaById:", error.message);
            throw error;
        }
    }

    async getPreguntaAlAzar() {
        try {
            return await PreguntasRepo.getPreguntaAlAzar();
        } catch (error) {
            console.error("Error en getPreguntaAlAzar:", error.message);
            throw error;
        }
    }

    async getPreguntas(palabraClave, ordenarPorFecha) {
        try {
            return await PreguntasRepo.getPreguntas(palabraClave, ordenarPorFecha);
        } catch (error) {
            console.error("Error en getPreguntas:", error.message);
            throw error;
        }
    }

    async deletePregunta(id) {
        try {
            const pregunta = await PreguntasRepo.getPreguntaById(id);
            if (!pregunta) {
                throw new Error("Pregunta no encontrada.");
            }

            return await PreguntasRepo.deletePregunta(id);
        } catch (error) {
            console.error("Error en deletePregunta:", error.message);
            throw error;
        }
    }
}
