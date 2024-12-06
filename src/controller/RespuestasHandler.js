import preguntaService from "../services/PreguntasServ.js";

const PreguntaService = new preguntaService();

export const obtenerPreguntas = async (req, res) => {
    try {
        const { palabraClave, ordenarPorFecha } = req.query;
        const preguntas = await PreguntaService.getPreguntas(palabraClave, ordenarPorFecha);
        res.status(200).json(preguntas);
    } catch (error) {
        console.error("Error obteniendo preguntas:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

export const obtenerPreguntaAlAzar = async (req, res) => {
    try {
        const pregunta = await PreguntaService.getPreguntaAlAzar();
        if (!pregunta) {
            return res.status(404).json({ error: "No hay preguntas disponibles." });
        }
        res.status(200).json(pregunta);
    } catch (error) {
        console.error("Error obteniendo pregunta al azar:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

export const eliminarPregunta = async (req, res) => {
    try {
        const { id } = req.params;
        const pregunta = await PreguntaService.getPreguntaById(id);

        if (!pregunta) {
            return res.status(404).json({ error: "Pregunta no encontrada." });
        }

        await PreguntaService.deletePregunta(id);
        res.status(200).json({ message: "Pregunta eliminada correctamente." });
    } catch (error) {
        console.error("Error eliminando pregunta:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

export const crearPregunta = async (req, res) => {
    try {
        const { pregunta, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta } = req.body;

        if (![pregunta, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta].every((campo) => typeof campo === "string")) {
            return res.status(400).json({ error: "Todos los campos deben ser cadenas de texto." });
        }

        if (![opcion1, opcion2, opcion3, opcion4].includes(respuestaCorrecta)) {
            return res.status(400).json({ error: "La respuesta correcta debe ser una de las opciones dadas." });
        }

        const fechaCreacion = new Date().toISOString();
        const nuevaPregunta = await PreguntaService.createPregunta({ pregunta, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta }, fechaCreacion);
        res.status(201).json({ message: "Pregunta creada exitosamente.", result: nuevaPregunta });
    } catch (error) {
        console.error("Error creando pregunta:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

export const actualizarPregunta = async (req, res) => {
    try {
        const { id } = req.params;
        const { pregunta, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta } = req.body;

        const preguntaExistente = await PreguntaService.getPreguntaById(id);
        if (!preguntaExistente) {
            return res.status(404).json({ error: "no se encontro la pregunta." });
        }

        const camposActualizados = {
            pregunta: pregunta || preguntaExistente.pregunta,
            opcion1: opcion1 || preguntaExistente.opcion1,
            opcion2: opcion2 || preguntaExistente.opcion2,
            opcion3: opcion3 || preguntaExistente.opcion3,
            opcion4: opcion4 || preguntaExistente.opcion4,
            respuestaCorrecta: respuestaCorrecta || preguntaExistente.respuestaCorrecta,
        };

        if (respuestaCorrecta && ![camposActualizados.opcion1, camposActualizados.opcion2, camposActualizados.opcion3, camposActualizados.opcion4].includes(respuestaCorrecta)) {
            return res.status(400).json({ error: "La respuesta correcta tiene que ser una de las opciones actuales." });
        }

        const preguntaActualizada = await PreguntaService.updatePregunta(id, camposActualizados);
        res.status(200).json({ message: "Pregunta actualizada correctamente.", result: preguntaActualizada });
    } catch (error) {
        console.error("Error actualizando pregunta:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};
