import { UserLocal } from './../models/entities';
import { ILoginState } from './ILoginState';
import { ILayoutState } from './ILayoutState';
import { IMetadataState } from './IMetadataState';

export interface IStoreState {
  readonly loginReducer : ILoginState;//unutma reducer fonksiyonunn ismi!!!!. Tek store ama her bir reducer için ayrı birer state.
  readonly layoutReducer: ILayoutState;
  readonly metadataReducer:IMetadataState;
}
