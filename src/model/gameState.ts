import { BASE_PARAMETERS, RECURSOS_INICIAIS, VASSALOS_INICIAIS } from './balance';
import { GameState, Season } from './types';

const ORDEM_ESTACOES: Season[] = ['Primavera', 'Verao', 'Outono', 'Inverno'];

export function proximaEstacao(estacaoAtual: Season): Season {
  const index = ORDEM_ESTACOES.indexOf(estacaoAtual);
  return ORDEM_ESTACOES[(index + 1) % ORDEM_ESTACOES.length];
}

export function criarEstadoInicial(seed: string): GameState {
  return {
    turno: 1,
    estacao: 'Primavera',
    recursos: { ...RECURSOS_INICIAIS },
    vassalos: VASSALOS_INICIAIS.map((v) => ({ ...v })),
    log: ['Um novo ano feudal começa.'],
    parametros: { ...BASE_PARAMETERS },
    flags: {
      pausado: false,
      autosaveDisponivel: false,
      seed
    },
    derrotas: {
      fome: 0,
      falencia: 0
    }
  };
}

export function calcularMediaLealdade(vassalos: GameState['vassalos']): number {
  if (vassalos.length === 0) {
    return 0;
  }
  const soma = vassalos.reduce((acc, v) => acc + v.lealdade, 0);
  return soma / vassalos.length;
}

export function atualizarTurno(state: GameState): void {
  state.estacao = proximaEstacao(state.estacao);
  if (state.estacao === 'Primavera') {
    state.turno += 1;
  }
}
