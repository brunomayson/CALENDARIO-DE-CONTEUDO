import { TurnAction } from '../systems/turns';

export function acaoLabel(acao: TurnAction): string {
  switch (acao) {
    case 'aumentar-impostos':
      return 'Aumentar impostos';
    case 'reduzir-impostos':
      return 'Reduzir impostos';
    case 'beneficio':
      return 'Conceder festa';
    case 'defesa':
      return 'Convocar defesa';
    case 'investir':
      return 'Investir nos feudos';
    default:
      return 'Nenhuma ação';
  }
}
