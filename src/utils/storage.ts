import { GameState } from '../model/types';

const STORAGE_KEY = 'senhorio-feudal-save';

export function salvar(state: GameState): void {
  try {
    const payload = JSON.stringify(state);
    window.localStorage.setItem(STORAGE_KEY, payload);
  } catch (error) {
    console.warn('Falha ao salvar progresso', error);
  }
}

export function carregar(): GameState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as GameState;
  } catch (error) {
    console.warn('Falha ao carregar progresso', error);
    return null;
  }
}

export function limpar(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}
