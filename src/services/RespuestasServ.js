import respuestasRepo from "../repos/RespuestasRep.js";

const RespuestasRepo = new respuestasRepo();

export default class RespuestaService {
    async createRespuesta(userId, preguntaId, respuestaSeleccionada, esCorrecta, fechaCreacion) {
        return await RespuestasRepo.createRespuesta(userId, preguntaId, respuestaSeleccionada, esCorrecta, fechaCreacion);
    }
    async getRespuestas(preguntaId, userId)
    {
    return await RespuestasRepo.getRespuestas(preguntaId, userId);
    }
    
    
}
