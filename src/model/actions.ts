import { PendingAction } from './types';

export type ActionId =
  | 'ajustar-impostos'
  | 'conceder-beneficio'
  | 'convocar-defesa'
  | 'investir-feudo';

export interface ActionDescriptor extends PendingAction {
  id: ActionId;
}
