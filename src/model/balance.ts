import { GameParameters, Resources, Vassal } from './types';

export const BASE_PARAMETERS: GameParameters = {
  maxTurnos: 12,
  vitoriaLealdade: 60,
  vitoriaOuro: 200,
  derrotaFomeTurnos: 2,
  derrotaFalenciaTurnos: 2,
  derrotaLealdade: 25
};

export const RECURSOS_INICIAIS: Resources = {
  comida: 120,
  ouro: 80,
  prestigio: 40,
  populacao: 60
};

export const VASSALOS_INICIAIS: Vassal[] = [
  {
    id: 'vassalo-avelar',
    nome: 'Senhor Avelar',
    lealdade: 55,
    militar: 40,
    produtividade: 50,
    intriga: 25,
    tributo: 12,
    beneficio: 8,
    protegeuUltimoInverno: false
  },
  {
    id: 'vassalo-beatriz',
    nome: 'Dama Beatriz',
    lealdade: 62,
    militar: 30,
    produtividade: 65,
    intriga: 18,
    tributo: 10,
    beneficio: 10,
    protegeuUltimoInverno: false
  },
  {
    id: 'vassalo-cassio',
    nome: 'Barão Cássio',
    lealdade: 48,
    militar: 55,
    produtividade: 45,
    intriga: 32,
    tributo: 14,
    beneficio: 6,
    protegeuUltimoInverno: false
  }
];

export const CONSUMO_POR_POPULACAO = 0.6;
export const PRODUTIVIDADE_BASE = 1.1;
export const TAXA_TRIBUTO_MAX = 20;
export const BONUS_FESTA = 8;
export const CUSTO_DEFESA = 15;
export const MELHORIA_FEUDO_CUSTO = 25;
export const MELHORIA_FEUDO_BONUS = 6;
