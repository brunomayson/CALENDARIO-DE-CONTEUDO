export type Season = 'Primavera' | 'Verao' | 'Outono' | 'Inverno';

export type ResourceType = 'comida' | 'ouro' | 'prestigio' | 'populacao';

export interface Resources {
  comida: number;
  ouro: number;
  prestigio: number;
  populacao: number;
}

export interface Vassal {
  id: string;
  nome: string;
  lealdade: number;
  militar: number;
  produtividade: number;
  intriga: number;
  tributo: number;
  beneficio: number;
  protegeuUltimoInverno: boolean;
}

export interface EventDefinition {
  id: string;
  nome: string;
  descricao: string;
  probabilidade: number;
  efeitos: Partial<Resources> & {
    lealdade?: number;
    prestigio?: number;
    militar?: number;
  };
  tipo: 'positivo' | 'negativo' | 'neutro';
}

export interface GameParameters {
  maxTurnos: number;
  vitoriaLealdade: number;
  vitoriaOuro: number;
  derrotaFomeTurnos: number;
  derrotaFalenciaTurnos: number;
  derrotaLealdade: number;
}

export interface TurnStats {
  turno: number;
  estacao: Season;
  eventos: string[];
}

export interface GameFlags {
  pausado: boolean;
  autosaveDisponivel: boolean;
  seed: string;
}

export interface GameState {
  turno: number;
  estacao: Season;
  recursos: Resources;
  vassalos: Vassal[];
  log: string[];
  parametros: GameParameters;
  flags: GameFlags;
  derrotas?: {
    fome: number;
    falencia: number;
  };
}

export interface PendingAction {
  id: string;
  nome: string;
  descricao: string;
  custo: Partial<Resources>;
  efeito: (state: GameState) => void;
  teclaAtalho?: string;
}

export type GameEnding =
  | { tipo: 'vitoria'; mensagem: string }
  | { tipo: 'derrota'; causa: 'fome' | 'motim' | 'falencia'; mensagem: string }
  | null;

export interface TurnOutcome {
  eventos: string[];
  ending: GameEnding;
}
