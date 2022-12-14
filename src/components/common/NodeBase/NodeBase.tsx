import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSetRecoilState } from 'recoil';
import { useModal } from '../../../hooks/modal';
import { useNode, useSourceDataFrame } from '../../../hooks/node';
import { NodeState } from '../../../models/dataNode';
import { ModalType } from '../../../models/modal';
import { edgesState, nodesState } from '../../../store/atoms';
import { NodeBaseMenu } from './NodeBaseMenu';
import { NodeBox, RowColumnCount, StateLine } from './styled';

interface BaseNodeProps {
  nodeId: string;
  nodeTypeName: string;
  children: ReactNode;
  state?: NodeState;
}

export const NodeBase = ({ nodeId, nodeTypeName, state, children }: BaseNodeProps) => {
  const { t } = useTranslation();

  const node = useNode(nodeId);
  const sourceDataFrame = useSourceDataFrame(nodeId);
  const { openModal } = useModal();
  const setNodes = useSetRecoilState(nodesState);
  const setEdges = useSetRecoilState(edgesState);

  const handleOpenDetail = () => {
    openModal(ModalType.Detail, nodeId);
  };

  const handleOpenDataPreview = () => {
    openModal(ModalType.Data, nodeId);
  };

  const handleSaveToFile = () => {
    node?.data.dataFrame?.toCSVFile();
  };

  const handleDeleteNode = () => {
    setNodes((nodes) => nodes.filter((n) => n.id !== nodeId));
    setEdges((edges) => edges.filter((e) => e.source !== nodeId && e.target !== nodeId));
  };

  const nodeState =
    state !== undefined
      ? state
      : node?.data.dataFrame
      ? NodeState.Processed
      : sourceDataFrame
      ? NodeState.InvalidSettings
      : NodeState.NoSource;

  return (
    <>
      <NodeBox onDoubleClick={handleOpenDetail} selected={node?.selected}>
        {nodeTypeName}
        <NodeBaseMenu
          nodeState={nodeState}
          onOpenDetail={handleOpenDetail}
          onOpenDataPreview={handleOpenDataPreview}
          onSaveToFile={handleSaveToFile}
          onDeleteNode={handleDeleteNode}
        />
        <StateLine state={nodeState} />
        {children}
      </NodeBox>

      {node?.data.dataFrame ? (
        <RowColumnCount>
          {`${node.data.dataFrame.count} ${t('nodes.base.rows')} | ${
            node.data.dataFrame.columns.length
          } ${t('nodes.base.columns')}`}
        </RowColumnCount>
      ) : null}
    </>
  );
};
