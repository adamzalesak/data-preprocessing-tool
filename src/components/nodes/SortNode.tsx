import _ from 'lodash';
import { useEffect } from 'react';
import { NodeProps, Position } from 'reactflow';
import { useTranslation } from 'react-i18next';
import { useNode, useSourceDataFrame, useUpdateNodeData } from '../../hooks/node';
import { SortNode as SortNodeModel } from '../../models/sortNode';
import { NodeBase } from '../common/NodeBase/NodeBase';
import { StyledHandle } from '../common/NodeBase/styled';

export const SortNode = ({ id }: NodeProps) => {
  const { t } = useTranslation();

  const node = useNode(id) as SortNodeModel | undefined;
  const sourceDataFrame = useSourceDataFrame(id);
  const updateNodeData = useUpdateNodeData<SortNodeModel>(id);

  // update node data
  useEffect(() => {
    if (!node) {
      return;
    }

    const nodeDataFrame =
      node.data.settings.sortColumn && node.data.settings.sortColumn !== ' '
        ? sourceDataFrame?.sort(node.data.settings.sortColumn, node.data.settings.direction)
        : undefined;

    updateNodeData('dataFrame', nodeDataFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceDataFrame, node?.data.settings]);

  // keep settings valid if sourceData changes
  useEffect(() => {
    if (!node) return;

    const sortColumn = sourceDataFrame?.columns
      .map((c) => c.name)
      .includes(node.data.settings.sortColumn)
      ? node.data.settings.sortColumn
      : '';

    updateNodeData('settings', { ...node?.data.settings, sortColumn });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceDataFrame]);

  return (
    <NodeBase nodeId={id} nodeTypeName={t('nodes.sort.title')}>
      <StyledHandle type="target" position={Position.Left} />
      <StyledHandle type="source" position={Position.Right} />
    </NodeBase>
  );
};
