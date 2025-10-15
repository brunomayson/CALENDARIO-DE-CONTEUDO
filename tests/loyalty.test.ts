import { describe, expect, it } from 'vitest';
import { criarEstadoInicial } from '../src/model/gameState';
import { atualizarLealdadePorImpostos, avaliarProtecaoInvernal } from '../src/systems/loyalty';
import { gerarSeedPadrao } from '../src/utils/seed';

function clonarEstado() {
  const estado = criarEstadoInicial(gerarSeedPadrao());
  estado.vassalos = estado.vassalos.map((v) => ({ ...v }));
  return estado;
}

describe('Lealdade dos vassalos', () => {
  it('reduz lealdade com impostos altos', () => {
    const state = clonarEstado();
    state.vassalos.forEach((v) => {
      v.tributo = 20;
    });
    const antes = state.vassalos.map((v) => v.lealdade);
    atualizarLealdadePorImpostos(state);
    state.vassalos.forEach((v, index) => {
      expect(v.lealdade).toBeLessThanOrEqual(antes[index]);
    });
  });

  it('aumenta lealdade com defesa eficaz', () => {
    const state = clonarEstado();
    state.vassalos.forEach((v) => {
      v.militar = 80;
    });
    const antes = state.vassalos.map((v) => v.lealdade);
    const mensagem = avaliarProtecaoInvernal(state);
    expect(mensagem).toContain('Patrulhas');
    state.vassalos.forEach((v, index) => {
      expect(v.lealdade).toBeGreaterThanOrEqual(antes[index]);
    });
  });
});
