import { GameLoop } from './core/loop';
import { SeededRng } from './core/rng';
import { criarEstadoInicial } from './model/gameState';
import { GameState } from './model/types';
import { resolverTurno, TurnAction } from './systems/turns';
import { renderizar } from './ui/renderer';
import { registrarInputs } from './ui/input';
import { criarUIState, UIState } from './ui/uiState';
import { carregar, limpar, salvar } from './utils/storage';
import { gerarSeedPadrao } from './utils/seed';
import { acaoLabel } from './ui/strings';

function assertCanvas(canvas: HTMLCanvasElement | null): HTMLCanvasElement {
  if (!canvas) {
    throw new Error('Canvas principal não encontrado.');
  }
  return canvas;
}

function ajustarCanvas(canvas: HTMLCanvasElement, ui: UIState): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Contexto 2D indisponível.');
  }
  const resize = () => {
    const { clientWidth, clientHeight } = canvas;
    canvas.width = clientWidth;
    canvas.height = clientHeight;
    ui.largura = canvas.width;
    ui.altura = canvas.height;
  };
  resize();
  window.addEventListener('resize', resize);
  return ctx;
}

function inicializarEstado(): GameState {
  const salvo = carregar();
  if (salvo) {
    salvo.flags.pausado = false;
    salvo.flags.autosaveDisponivel = false;
    return salvo;
  }
  return criarEstadoInicial(gerarSeedPadrao());
}

const canvas = assertCanvas(document.getElementById('game') as HTMLCanvasElement | null);
const uiState = criarUIState();
const ctx = ajustarCanvas(canvas, uiState);
let state = inicializarEstado();
let rng = new SeededRng(state.flags.seed);
let acaoSelecionada: TurnAction = 'nenhuma';

function mostrarMensagem(texto: string): void {
  uiState.mensagemTemporaria = texto;
  setTimeout(() => {
    uiState.mensagemTemporaria = null;
  }, 2200);
}

function atualizarSelecao(acao: TurnAction): void {
  acaoSelecionada = acao;
  uiState.acaoSelecionada = acao;
  mostrarMensagem(`Ação preparada: ${acaoLabel(acao)}`);
}

function avancarTurno(): void {
  if (state.flags.pausado) {
    mostrarMensagem('O jogo está pausado. Pressione R para reiniciar.');
    return;
  }
  const resultado = resolverTurno(state, rng, acaoSelecionada);
  resultado.eventos.forEach((evento) => console.info(evento));
  if (state.flags.autosaveDisponivel) {
    salvar(state);
    state.flags.autosaveDisponivel = false;
  }
  if (resultado.ending) {
    state.flags.pausado = true;
    mostrarMensagem(resultado.ending.mensagem);
  }
}

function reiniciar(): void {
  limpar();
  state = criarEstadoInicial(gerarSeedPadrao());
  rng = new SeededRng(state.flags.seed);
  state.flags.pausado = false;
  state.flags.autosaveDisponivel = false;
  uiState.acaoSelecionada = 'nenhuma';
  uiState.vassaloSelecionado = 0;
  acaoSelecionada = 'nenhuma';
  mostrarMensagem('Nova campanha iniciada.');
}

function alternarPausa(): void {
  state.flags.pausado = !state.flags.pausado;
  mostrarMensagem(state.flags.pausado ? 'Jogo pausado.' : 'Jogo retomado.');
}

registrarInputs(canvas, uiState, {
  onSelectVassal: (index) => {
    uiState.vassaloSelecionado = Math.max(0, Math.min(state.vassalos.length - 1, index));
  },
  onSelectAction: (acao) => atualizarSelecao(acao),
  onAdvanceTurn: () => avancarTurno(),
  onTogglePause: () => alternarPausa(),
  onReset: () => reiniciar()
});

const loop = new GameLoop({
  update: () => {
    // Loop fixo mantém consistência; lógica por turnos ocorre via eventos de input.
  },
  render: () => {
    renderizar(ctx, state, uiState);
  },
  fps: 60
});

loop.start();

console.info('Controles: 1/2/3 para ações rápidas, D defesa, I investir, espaço para avançar turno, P pausa, R reinicia.');
