import { DataNode } from './dataNode';
import { NodeType } from './nodeTypes';

export interface OneHotEncoderNodeSetting {
  columnName?: string;
  dropFirst?: boolean;
}

export interface OneHotEncoderNodeAdditionalData {
  settings: OneHotEncoderNodeSetting;
}

export type OneHotEncoderNode = DataNode<NodeType.OneHotEncoder, OneHotEncoderNodeAdditionalData>;

