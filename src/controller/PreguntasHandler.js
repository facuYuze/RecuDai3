import preguntaService from "../services/PreguntasServ.js";

const PreguntaService = new preguntaService();

export const obtenerPreguntas = async (req, res, next) => {
    const { palabraClave, ordenarPorFecha } = req.query;
    try {
        const preguntas = await PreguntaService.getPreguntas(palabraClave, ordenarPorFecha);
        res.status(200).json(preguntas);
    } catch (error) {
        next(error);
    }
};

export const obtenerPreguntaAlAzar = async (req, res, next) => {
    try {
        const pregunta = await PreguntaService.getPreguntaAlAzar();
        if (!pregunta) {
            return res.status(404).json({ error: 'No hay preguntas disponibles.' });
        }
        res.status(200).json(pregunta);
    } catch (error) {
        next(error);
    }
};

export const eliminarPregunta = async (req, res, next) => {
    const { id } = req.params;
    try {
        const pregunta = await PreguntaService.getPreguntaById(id);
        if (!pregunta) {
            return res.status(404).json({ error: "Pregunta no encontrada." });
        }
        await PreguntaService.deletePregunta(id);
        res.status(200).json({ message: "Pregunta eliminada correctamente." });
    } catch (error) {
        next(error);
    }
};

export const crearPregunta = async (req, res, next) => {
    const { pregunta, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta } = req.body;
    try {
        if (![pregunta, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta].every((campo) => typeof campo === 'string')) {
            return res.status(400).json({ error: "Todos los campos deben ser cadenas de texto." });
        }
        if (![opcion1, opcion2, opcion3, opcion4].includes(respuestaCorrecta)) {
            return res.status(400).json({ error: "La respuesta correcta debe ser una de las opciones proporcionadas." });
        }
        const fechaCreacion = new Date().toISOString();
        const nuevaPregunta = await PreguntaService.createPregunta({ pregunta, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta }, fechaCreacion);
        res.status(201).json({ message: 'Pregunta creada exitosamente.', result: nuevaPregunta });
    } catch (error) {
        next(error);
    }
};

export const actualizarPregunta = async (req, res, next) => {
    const { id } = req.params;
    const { pregunta, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta } = req.body;

    try {
        const preguntaExistente = await PreguntaService.getPreguntaById(id);
        if (!preguntaExistente) {
            return res.status(404).json({ error: "Pregunta no encontrada" });
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
            return res.status(400).json({ error: "La respuesta correcta debe coincidir con una de las opciones." });
        }

        const preguntaActualizada = await PreguntaService.updatePregunta(id, camposActualizados);
        res.status(200).json({ message: "Pregunta actualizada correctamente.", result: preguntaActualizada });
    } catch (error) {
        next(error);
    }
};
