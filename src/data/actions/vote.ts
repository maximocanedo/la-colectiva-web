import { u } from "../utils";
import { VoteStatus, VoteType } from "../models/vote";
import { Err } from "../error";
/**
 * Emitir un voto hacia un recurso.
 * @param type Tipo de voto que se desea emitir.
 * @param pre Prefijo de la URL del recurso que se desea votar.
 */
const vote = async (type: VoteType, pre: string): Promise<VoteStatus> => {
    const isUp: boolean = type === VoteType.UP,
        isNone: boolean = type === VoteType.NONE;
    const call: Response = await u[isNone ? "del" : "post"](`${pre}/vote/${(isUp&&"up")||"down"}vote`, {});
    const data = await call.json();
    if(call.ok) {
        return data;
    } else {
        throw new Err(data.error);
    }
};
/**
 * Obtener información sobre los votos.
 * @param pre Prefijo de la URL del recurso en cuestión.
 */
export const getVotes = async (pre: string): Promise<VoteStatus> => {
    const call: Response = await u.get(`${pre}/vote`);
    const data = await call.json();
    if(call.ok) {
        return data;
    } else {
        throw new Err(data.error);
    }
};
/**
 * Dar upvote a un recurso.
 * @param pre Prefijo de la URL del recurso en cuestión.
 */
export const upvote = async (pre: string): Promise<VoteStatus> => await vote(VoteType.UP, pre);
/**
 * Dar downvote a un recurso.
 * @param pre Prefijo de la URL del recurso en cuestión.
 */
export const downvote = async (pre: string): Promise<VoteStatus> => await vote(VoteType.DOWN, pre);