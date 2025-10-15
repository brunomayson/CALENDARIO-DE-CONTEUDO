import { GameState } from '../model/types';
import { TurnAction } from '../systems/turns';
import { LAYOUT, CORES } from './theme';
import { UIState } from './uiState';
import { acaoLabel } from './strings';

function desenharPainel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = CORES.painel;
  ctx.fillRect(x, y, w, h);
}

function desenharTexto(
  ctx: CanvasRenderingContext2D,
  texto: string,
  x: number,
  y: number,
  options: { tamanho?: number; cor?: string; bold?: boolean } = {}
): void {
  const tamanho = options.tamanho ?? 16;
  const peso = options.bold ? '600' : '400';
  ctx.fillStyle = options.cor ?? CORES.texto;
  ctx.font = `${peso} ${tamanho}px 'Segoe UI', Tahoma, sans-serif`;
  ctx.fillText(texto, x, y);
}

function desenharRecursos(ctx: CanvasRenderingContext2D, state: GameState, largura: number): void {
  desenharPainel(ctx, 0, 0, largura, LAYOUT.hudAltura);
  const { recursos, estacao, turno } = state;
  const textos = [
    `Turno ${turno} - ${estacao}`,
    `Comida: ${Math.round(recursos.comida)}`,
    `Ouro: ${Math.round(recursos.ouro)}`,
    `Prestígio: ${Math.round(recursos.prestigio)}`,
    `População: ${Math.round(recursos.populacao)}`
  ];
  textos.forEach((texto, index) => {
    desenharTexto(ctx, texto, 24 + index * 180, 38, {
      tamanho: 16,
      bold: index === 0,
      cor: index === 0 ? CORES.destaque : CORES.texto
    });
  });
}

function desenharVassalos(ctx: CanvasRenderingContext2D, state: GameState, ui: UIState): void {
  desenharPainel(ctx, 0, LAYOUT.hudAltura, LAYOUT.listaLargura, ui.altura - LAYOUT.hudAltura - LAYOUT.logAltura);
  desenharTexto(ctx, 'Vassalos', 16, LAYOUT.hudAltura + 28, { bold: true, tamanho: 18 });
  state.vassalos.forEach((vassalo, index) => {
    const y = LAYOUT.hudAltura + 60 + index * 80;
    const selecionado = ui.vassaloSelecionado === index;
    if (selecionado) {
      ctx.strokeStyle = CORES.destaque;
      ctx.lineWidth = 2;
      ctx.strokeRect(8, y - 40, LAYOUT.listaLargura - 16, 72);
    }
    desenharTexto(ctx, vassalo.nome, 20, y, { bold: true });
    desenharTexto(ctx, `Lealdade: ${Math.round(vassalo.lealdade)}%`, 20, y + 20);
    desenharTexto(ctx, `Militar: ${Math.round(vassalo.militar)} / Prod: ${Math.round(vassalo.produtividade)}`, 20, y + 40, {
      tamanho: 14
    });
  });
}

function desenharAcoes(ctx: CanvasRenderingContext2D, ui: UIState, larguraTotal: number): void {
  const x = larguraTotal - LAYOUT.acoesLargura;
  desenharPainel(ctx, x, LAYOUT.hudAltura, LAYOUT.acoesLargura, ui.altura - LAYOUT.hudAltura - LAYOUT.logAltura);
  desenharTexto(ctx, 'Ações', x + 16, LAYOUT.hudAltura + 28, { bold: true, tamanho: 18 });
  const acoes: TurnAction[] = ['aumentar-impostos', 'reduzir-impostos', 'beneficio', 'defesa', 'investir'];
  acoes.forEach((acao, index) => {
    const top = LAYOUT.hudAltura + 60 + index * 68;
    const selecionado = ui.acaoSelecionada === acao;
    if (selecionado) {
      ctx.strokeStyle = CORES.destaque;
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 8, top - 36, LAYOUT.acoesLargura - 16, 56);
    }
    desenharTexto(ctx, `${acaoLabel(acao)}${index < 3 ? ` (${index + 1})` : ''}`, x + 16, top, {
      tamanho: 15
    });
  });

  if (ui.mensagemTemporaria) {
    desenharTexto(ctx, ui.mensagemTemporaria, x + 16, ui.altura - LAYOUT.logAltura - 16, {
      cor: CORES.alerta,
      tamanho: 14
    });
  }
}

function desenharLog(ctx: CanvasRenderingContext2D, state: GameState, ui: UIState, larguraTotal: number): void {
  const y = ui.altura - LAYOUT.logAltura;
  desenharPainel(ctx, 0, y, larguraTotal, LAYOUT.logAltura);
  desenharTexto(ctx, 'Crônicas do Feudo', 16, y + 28, { bold: true });
  const linhas = state.log.slice(-6);
  linhas.forEach((linha, index) => {
    const textoColor =
      linha.toLowerCase().includes('fome') || linha.toLowerCase().includes('saque')
        ? CORES.perigo
        : CORES.texto;
    desenharTexto(ctx, linha, 16, y + 52 + index * 22, { tamanho: 14, cor: textoColor });
  });
}

export function renderizar(ctx: CanvasRenderingContext2D, state: GameState, ui: UIState): void {
  ctx.clearRect(0, 0, ui.largura, ui.altura);
  ctx.fillStyle = CORES.fundo;
  ctx.fillRect(0, 0, ui.largura, ui.altura);
  desenharRecursos(ctx, state, ui.largura);
  desenharVassalos(ctx, state, ui);
  desenharAcoes(ctx, ui, ui.largura);
  desenharLog(ctx, state, ui, ui.largura);
}
