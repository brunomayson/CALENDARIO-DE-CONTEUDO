import { describe, expect, it } from 'vitest';
import { criarEstadoInicial } from '../src/model/gameState';
import { ajustarImpostos, consumirRecursos, produzirAlimentos } from '../src/systems/economy';
import { gerarSeedPadrao } from '../src/utils/seed';

describe('Economia feudal', () => {
  it('não permite tributos negativos', () => {
    const state = criarEstadoInicial(gerarSeedPadrao());
    ajustarImpostos(state, -50);
    state.vassalos.forEach((v) => {
      expect(v.tributo).toBeGreaterThanOrEqual(0);
    });
  });

  it('consome comida proporcional à população', () => {
    const state = criarEstadoInicial(gerarSeedPadrao());
    state.recursos.populacao = 100;
    const mensagem = consumirRecursos(state);
    expect(mensagem).toContain('consome');
    expect(state.recursos.comida).toBeLessThan(120);
  });

  it('produz comida a partir da produtividade', () => {
    const state = criarEstadoInicial(gerarSeedPadrao());
    state.vassalos.forEach((v) => {
      v.produtividade = 100;
    });
    const comidaAntes = state.recursos.comida;
    const mensagem = produzirAlimentos(state);
    expect(mensagem).toContain('produção rendeu');
    expect(state.recursos.comida).toBeGreaterThan(comidaAntes);
  });
});
