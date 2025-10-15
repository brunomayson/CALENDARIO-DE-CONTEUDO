import { SeededRng } from '../core/rng';
import { GameState, Vassal } from '../model/types';

function clamp(valor: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, valor));
}

function ajustarPorPersonalidade(vassalo: Vassal, rng: SeededRng): string {
  const tendencia = rng.next();
  if (tendencia < vassalo.intriga / 150) {
    vassalo.lealdade = clamp(vassalo.lealdade - 4, 0, 100);
    return `${vassalo.nome} espalha boatos e perde confiança.`;
  }
  if (tendencia > 0.85) {
    vassalo.lealdade = clamp(vassalo.lealdade + 3, 0, 100);
    return `${vassalo.nome} reconhece sua liderança.`;
  }
  return `${vassalo.nome} mantém-se atento aos acontecimentos.`;
}

export function atualizarPersonalidades(state: GameState, rng: SeededRng): string[] {
  return state.vassalos.map((vassalo) => ajustarPorPersonalidade(vassalo, rng));
}
