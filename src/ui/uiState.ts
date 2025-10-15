import { TurnAction } from '../systems/turns';

export interface UIState {
  largura: number;
  altura: number;
  vassaloSelecionado: number;
  acaoSelecionada: TurnAction;
  mensagemTemporaria: string | null;
}

export function criarUIState(): UIState {
  return {
    largura: 1024,
    altura: 768,
    vassaloSelecionado: 0,
    acaoSelecionada: 'nenhuma',
    mensagemTemporaria: null
  };
}
