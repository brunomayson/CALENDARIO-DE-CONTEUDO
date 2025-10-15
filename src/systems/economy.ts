import {
  BONUS_FESTA,
  CONSUMO_POR_POPULACAO,
  CUSTO_DEFESA,
  MELHORIA_FEUDO_BONUS,
  MELHORIA_FEUDO_CUSTO,
  PRODUTIVIDADE_BASE,
  TAXA_TRIBUTO_MAX
} from '../model/balance';
import { GameState, Vassal } from '../model/types';

function clamp(valor: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, valor));
}

export function produzirAlimentos(state: GameState): string {
  const produtividadeTotal = state.vassalos.reduce(
    (acc, vassalo) => acc + vassalo.produtividade,
    0
  );
  const bonusMelhorias = state.vassalos.filter((v) => v.beneficio > 0).length * MELHORIA_FEUDO_BONUS;
  const produzido = Math.round(
    (produtividadeTotal / state.vassalos.length) * PRODUTIVIDADE_BASE + bonusMelhorias
  );
  state.recursos.comida += produzido;
  return `A produção rendeu ${produzido} de comida.`;
}

export function coletarImpostos(state: GameState): string {
  const arrecadado = state.vassalos.reduce((total, vassalo) => total + vassalo.tributo, 0);
  state.recursos.ouro += arrecadado;
  return `Os cobradores recolhem ${arrecadado} moedas em impostos.`;
}

export function consumirRecursos(state: GameState): string {
  const consumo = Math.round(state.recursos.populacao * CONSUMO_POR_POPULACAO);
  state.recursos.comida -= consumo;
  return `O inverno consome ${consumo} de comida.`;
}

export function ajustarImpostos(state: GameState, ajuste: number): string {
  state.vassalos.forEach((vassalo) => {
    const novoTributo = clamp(vassalo.tributo + ajuste, 0, TAXA_TRIBUTO_MAX);
    vassalo.tributo = novoTributo;
    vassalo.lealdade = clamp(vassalo.lealdade - ajuste * 0.8, 0, 100);
  });
  return ajuste >= 0
    ? 'Os tributos aumentaram e os vassalos resmungam.'
    : 'Um alívio nos impostos anima a corte.';
}

export function concederBeneficios(state: GameState): string {
  if (state.recursos.ouro < 15 || state.recursos.comida < 10) {
    return 'Os recursos não permitem uma festa digna.';
  }
  state.vassalos.forEach((vassalo) => {
    vassalo.lealdade = clamp(vassalo.lealdade + BONUS_FESTA, 0, 100);
    vassalo.beneficio += 1;
  });
  state.recursos.ouro -= 15;
  state.recursos.comida -= 10;
  return 'Uma grande festa fortalece laços e reputação.';
}

export function convocarDefesa(state: GameState): string {
  if (state.recursos.ouro < CUSTO_DEFESA || state.recursos.comida < 5) {
    return 'Os recursos não bastam para convocar a defesa.';
  }
  state.recursos.ouro -= CUSTO_DEFESA;
  state.recursos.comida -= 5;
  state.vassalos.forEach((vassalo) => {
    vassalo.militar = clamp(vassalo.militar + 5, 0, 100);
    vassalo.protegeuUltimoInverno = true;
  });
  state.recursos.prestigio += 6;
  return 'As defesas são reforçadas e os vassalos sentem-se protegidos.';
}

export function investirFeudo(state: GameState): string {
  if (state.recursos.ouro < MELHORIA_FEUDO_CUSTO) {
    return 'Os cofres não permitem novas melhorias.';
  }
  state.recursos.ouro -= MELHORIA_FEUDO_CUSTO;
  state.vassalos.forEach((vassalo) => {
    vassalo.produtividade += 5;
    vassalo.lealdade = clamp(vassalo.lealdade + 3, 0, 100);
  });
  return 'A infraestrutura dos feudos é modernizada, aumentando a produtividade.';
}

export function verificarFome(state: GameState): boolean {
  if (!state.derrotas) {
    state.derrotas = { fome: 0, falencia: 0 };
  }
  if (state.recursos.comida < 0) {
    state.derrotas.fome += 1;
  } else {
    state.derrotas.fome = 0;
  }
  return state.derrotas.fome >= state.parametros.derrotaFomeTurnos;
}

export function verificarFalencia(state: GameState): boolean {
  if (!state.derrotas) {
    state.derrotas = { fome: 0, falencia: 0 };
  }
  if (state.recursos.ouro < 0) {
    state.derrotas.falencia += 1;
  } else {
    state.derrotas.falencia = 0;
  }
  return state.derrotas.falencia >= state.parametros.derrotaFalenciaTurnos;
}

export function mediaMilitar(vassalos: Vassal[]): number {
  if (vassalos.length === 0) {
    return 0;
  }
  const soma = vassalos.reduce((acc, v) => acc + v.militar, 0);
  return soma / vassalos.length;
}
