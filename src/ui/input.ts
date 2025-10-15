import { LAYOUT } from './theme';
import { UIState } from './uiState';
import { TurnAction } from '../systems/turns';

export interface InputCallbacks {
  onSelectVassal: (index: number) => void;
  onSelectAction: (action: TurnAction) => void;
  onAdvanceTurn: () => void;
  onTogglePause: () => void;
  onReset: () => void;
}

const TECLA_ACAO: Record<string, TurnAction> = {
  Digit1: 'aumentar-impostos',
  Digit2: 'reduzir-impostos',
  Digit3: 'beneficio',
  KeyD: 'defesa',
  KeyI: 'investir'
};

export function registrarInputs(
  canvas: HTMLCanvasElement,
  ui: UIState,
  callbacks: InputCallbacks
): void {
  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * ui.largura;
    const y = ((event.clientY - rect.top) / rect.height) * ui.altura;

    if (y > LAYOUT.hudAltura && x < LAYOUT.listaLargura) {
      const index = Math.floor((y - LAYOUT.hudAltura - 20) / 80);
      if (index >= 0) {
        callbacks.onSelectVassal(index);
      }
    }

    const acoesX = ui.largura - LAYOUT.acoesLargura;
    if (x > acoesX && y > LAYOUT.hudAltura && y < ui.altura - LAYOUT.logAltura) {
      const index = Math.floor((y - LAYOUT.hudAltura - 20) / 68);
      const acoes: TurnAction[] = ['aumentar-impostos', 'reduzir-impostos', 'beneficio', 'defesa', 'investir'];
      const acao = acoes[index];
      if (acao) {
        callbacks.onSelectAction(acao);
      }
    }

    if (y > ui.altura - LAYOUT.logAltura) {
      callbacks.onAdvanceTurn();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.repeat) {
      return;
    }
    if (event.code === 'Space' || event.code === 'Enter') {
      callbacks.onAdvanceTurn();
      return;
    }
    if (event.code === 'KeyP') {
      callbacks.onTogglePause();
      return;
    }
    if (event.code === 'KeyR') {
      callbacks.onReset();
      return;
    }
    const acao = TECLA_ACAO[event.code];
    if (acao) {
      callbacks.onSelectAction(acao);
    }
  });
}
