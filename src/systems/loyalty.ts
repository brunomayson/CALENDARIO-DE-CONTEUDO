import { GameState, Vassal } from '../model/types';
import { mediaMilitar } from './economy';

function clamp(valor: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, valor));
}

export function atualizarLealdadePorImpostos(state: GameState): string {
  const mediaTributos = state.vassalos.reduce((acc, v) => acc + v.tributo, 0) / state.vassalos.length;
  const ajuste = mediaTributos > 12 ? -6 : mediaTributos < 8 ? 4 : 1;
  state.vassalos.forEach((vassalo) => {
    vassalo.lealdade = clamp(vassalo.lealdade + ajuste, 0, 100);
  });
  return ajuste >= 0
    ? 'A política tributária mantém os vassalos satisfeitos.'
    : 'Os vassalos murmuram diante dos cobradores exigentes.';
}

export function avaliarProtecaoInvernal(state: GameState): string {
  const militar = mediaMilitar(state.vassalos);
  const mensagem =
    militar >= 45
      ? 'Patrulhas eficazes mantêm as terras seguras.'
      : 'A falta de patrulhas enfraquece a confiança nas defesas.';
  const ajuste = militar >= 45 ? 4 : -5;
  state.vassalos.forEach((vassalo) => {
    if (vassalo.protegeuUltimoInverno) {
      vassalo.lealdade = clamp(vassalo.lealdade + 3, 0, 100);
      vassalo.protegeuUltimoInverno = false;
    }
    vassalo.lealdade = clamp(vassalo.lealdade + ajuste, 0, 100);
  });
  return mensagem;
}

export function reagirABeneficios(state: GameState): string {
  state.vassalos.forEach((vassalo) => {
    if (vassalo.beneficio > 0) {
      vassalo.lealdade = clamp(vassalo.lealdade + vassalo.beneficio * 0.5, 0, 100);
      vassalo.beneficio = Math.max(0, vassalo.beneficio - 1);
    }
  });
  return 'Os vassalos lembram de sua generosidade recente.';
}

export function penalizarIntrigas(vassalos: Vassal[]): string {
  const intrigaAlta = vassalos.filter((v) => v.intriga >= 30);
  intrigaAlta.forEach((vassalo) => {
    vassalo.lealdade = clamp(vassalo.lealdade - vassalo.intriga * 0.1, 0, 100);
  });
  return intrigaAlta.length
    ? 'Rumores ganham força entre os nobres mais ardilosos.'
    : 'A corte permanece relativamente estável e leal.';
}
