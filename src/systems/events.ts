import { EVENTOS } from '../model/events';
import { GameState } from '../model/types';
import { SeededRng } from '../core/rng';

export function sortearEvento(rng: SeededRng): number {
  const roll = rng.next();
  let acumulado = 0;
  for (let i = 0; i < EVENTOS.length; i += 1) {
    acumulado += EVENTOS[i].probabilidade;
    if (roll <= acumulado) {
      return i;
    }
  }
  return EVENTOS.length - 1;
}

export function aplicarEvento(state: GameState, rng: SeededRng): string {
  const indice = sortearEvento(rng);
  const evento = EVENTOS[indice];
  const efeitos = evento.efeitos;
  if (efeitos.comida) {
    state.recursos.comida += efeitos.comida;
  }
  if (efeitos.ouro) {
    state.recursos.ouro += efeitos.ouro;
  }
  if (efeitos.prestigio) {
    state.recursos.prestigio += efeitos.prestigio;
  }
  if (efeitos.populacao) {
    state.recursos.populacao = Math.max(0, state.recursos.populacao + efeitos.populacao);
  }
  if (efeitos.lealdade) {
    state.vassalos.forEach((vassalo) => {
      vassalo.lealdade = Math.max(0, Math.min(100, vassalo.lealdade + efeitos.lealdade!));
    });
  }
  if (efeitos.militar) {
    state.vassalos.forEach((vassalo) => {
      vassalo.militar = Math.max(0, Math.min(100, vassalo.militar + efeitos.militar!));
    });
  }
  state.log.push(`${evento.nome}: ${evento.descricao}`);
  return `${evento.nome}: ${evento.descricao}`;
}
