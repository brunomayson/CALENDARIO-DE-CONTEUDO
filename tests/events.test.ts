import { describe, expect, it } from 'vitest';
import { EVENTOS, validarProbabilidades } from '../src/model/events';
import { criarEstadoInicial } from '../src/model/gameState';
import { aplicarEvento } from '../src/systems/events';
import { SeededRng } from '../src/core/rng';

describe('Eventos aleatórios', () => {
  it('probabilidades somam 1', () => {
    expect(validarProbabilidades()).toBe(true);
  });

  it('aplica efeitos no estado', () => {
    const state = criarEstadoInicial('teste');
    const rng = new SeededRng('teste');
    const antes = { ...state.recursos };
    const mensagem = aplicarEvento(state, rng);
    expect(typeof mensagem).toBe('string');
    const alterado =
      antes.comida !== state.recursos.comida ||
      antes.ouro !== state.recursos.ouro ||
      antes.prestigio !== state.recursos.prestigio ||
      antes.populacao !== state.recursos.populacao;
    expect(alterado).toBe(true);
    expect(EVENTOS.some((evento) => mensagem.includes(evento.nome))).toBe(true);
  });
});
