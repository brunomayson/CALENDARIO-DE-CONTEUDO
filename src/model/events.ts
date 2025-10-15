import { EventDefinition } from './types';

export const EVENTOS: EventDefinition[] = [
  {
    id: 'colheita-farta',
    nome: 'Colheita Farta',
    descricao: 'As chuvas foram perfeitas; celeiros se enchem e vassalos sorriem.',
    probabilidade: 0.2,
    efeitos: { comida: 40, lealdade: 5, prestigio: 3 },
    tipo: 'positivo'
  },
  {
    id: 'raid-fronteira',
    nome: 'Saque nas Fronteiras',
    descricao: 'Bandoleiros pilham um feudo desprotegido e exigem resgate.',
    probabilidade: 0.15,
    efeitos: { comida: -25, ouro: -20, lealdade: -6 },
    tipo: 'negativo'
  },
  {
    id: 'praga',
    nome: 'Praga entre os Camponeses',
    descricao: 'Doenças reduzem a força de trabalho e assustam a população.',
    probabilidade: 0.1,
    efeitos: { comida: -15, populacao: -6, lealdade: -4 },
    tipo: 'negativo'
  },
  {
    id: 'visita-rei',
    nome: 'Visita do Rei',
    descricao: 'O rei visita seus domínios e cobra etiqueta impecável.',
    probabilidade: 0.08,
    efeitos: { ouro: -10, prestigio: 6, lealdade: 4 },
    tipo: 'positivo'
  },
  {
    id: 'mercadores',
    nome: 'Caravana de Mercadores',
    descricao: 'Mercadores pagam pedágio justo em troca de passagem segura.',
    probabilidade: 0.12,
    efeitos: { ouro: 18, prestigio: 2 },
    tipo: 'positivo'
  },
  {
    id: 'inverno-rigido',
    nome: 'Inverno Rígido',
    descricao: 'Nevascas prolongadas drenam os celeiros e testam a lealdade.',
    probabilidade: 0.1,
    efeitos: { comida: -30, lealdade: -5 },
    tipo: 'negativo'
  },
  {
    id: 'intrigas-corte',
    nome: 'Intrigas na Corte',
    descricao: 'Rumores corroem a confiança de um vassalo e ele exige provas de apoio.',
    probabilidade: 0.15,
    efeitos: { lealdade: -7, prestigio: -3 },
    tipo: 'negativo'
  },
  {
    id: 'guerreiros-leais',
    nome: 'Guerreiros Leais',
    descricao: 'Soldados treinados retornam com histórias heroicas.',
    probabilidade: 0.1,
    efeitos: { lealdade: 6, militar: 4, prestigio: 5 },
    tipo: 'positivo'
  }
];

export function validarProbabilidades(): boolean {
  const soma = EVENTOS.reduce((acc, evento) => acc + evento.probabilidade, 0);
  return Math.abs(1 - soma) < 0.0001;
}
