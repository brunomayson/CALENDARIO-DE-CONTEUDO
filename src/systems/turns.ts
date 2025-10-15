import { SeededRng } from '../core/rng';
import { calcularMediaLealdade, atualizarTurno } from '../model/gameState';
import { GameEnding, GameState, TurnOutcome } from '../model/types';
import {
  ajustarImpostos,
  concederBeneficios,
  convocarDefesa,
  consumirRecursos,
  coletarImpostos,
  investirFeudo,
  produzirAlimentos,
  verificarFalencia,
  verificarFome
} from './economy';
import { aplicarEvento } from './events';
import {
  atualizarLealdadePorImpostos,
  avaliarProtecaoInvernal,
  penalizarIntrigas,
  reagirABeneficios
} from './loyalty';
import { atualizarPersonalidades } from './ai';

export type TurnAction =
  | 'nenhuma'
  | 'aumentar-impostos'
  | 'reduzir-impostos'
  | 'beneficio'
  | 'defesa'
  | 'investir';

function processarAcao(state: GameState, action: TurnAction): string | null {
  switch (action) {
    case 'aumentar-impostos':
      return ajustarImpostos(state, 2);
    case 'reduzir-impostos':
      return ajustarImpostos(state, -2);
    case 'beneficio':
      return concederBeneficios(state);
    case 'defesa':
      return convocarDefesa(state);
    case 'investir':
      return investirFeudo(state);
    default:
      return null;
  }
}

function verificarFim(state: GameState): GameEnding {
  const mediaLealdade = calcularMediaLealdade(state.vassalos);
  const atingiuTurnoFinal = state.turno >= state.parametros.maxTurnos;
  const lealdadeAlta = mediaLealdade >= state.parametros.vitoriaLealdade;
  const ouroSuficiente = state.recursos.ouro >= state.parametros.vitoriaOuro;

  if (atingiuTurnoFinal && lealdadeAlta && ouroSuficiente) {
    return {
      tipo: 'vitoria',
      mensagem: 'Seu domínio prospera e o rei reconhece seu legado!'
    };
  }

  if (mediaLealdade < state.parametros.derrotaLealdade) {
    return {
      tipo: 'derrota',
      causa: 'motim',
      mensagem: 'Os vassalos se rebelam contra sua tirania.'
    };
  }

  if (verificarFome(state)) {
    return { tipo: 'derrota', causa: 'fome', mensagem: 'A fome devasta o feudo; camponeses fogem.' };
  }

  if (verificarFalencia(state)) {
    return {
      tipo: 'derrota',
      causa: 'falencia',
      mensagem: 'Os cofres vazios derrubam sua autoridade.'
    };
  }

  return null;
}

export function resolverTurno(state: GameState, rng: SeededRng, action: TurnAction): TurnOutcome {
  const mensagens: string[] = [];
  const acaoMensagem = processarAcao(state, action);
  if (acaoMensagem) {
    mensagens.push(acaoMensagem);
  }

  switch (state.estacao) {
    case 'Primavera':
    case 'Verao':
      mensagens.push(produzirAlimentos(state));
      mensagens.push(reagirABeneficios(state));
      break;
    case 'Outono':
      mensagens.push(coletarImpostos(state));
      mensagens.push(atualizarLealdadePorImpostos(state));
      break;
    case 'Inverno':
      mensagens.push(consumirRecursos(state));
      mensagens.push(avaliarProtecaoInvernal(state));
      mensagens.push(aplicarEvento(state, rng));
      break;
    default:
      break;
  }

  mensagens.push(...atualizarPersonalidades(state, rng));
  mensagens.push(penalizarIntrigas(state.vassalos));

  const ending = verificarFim(state);
  state.log.push(...mensagens);

  if (!ending) {
    atualizarTurno(state);
    state.flags.autosaveDisponivel = true;
  }

  return {
    eventos: mensagens,
    ending
  };
}
