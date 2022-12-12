import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NodeProps, Position } from 'reactflow';
import { useNode, useSourceDataFrame, useUpdateNodeData } from '../../hooks/node';
import { OneHotEncoderNode as OneHotEncoderNodeModel } from '../../models/oneHotEncoderNode';
import { NodeBase } from '../common/NodeBase/NodeBase';
import { StyledHandle } from '../common/NodeBase/styled';

export const OneHotEncoderNode = ({ id }: NodeProps) => {
  const { t } = useTranslation();

  const node = useNode(id) as OneHotEncoderNodeModel | undefined;
  const sourceDataFrame = useSourceDataFrame(id);
  const updateNodeData = useUpdateNodeData<OneHotEncoderNodeModel>(id);

  useEffect(() => {
    if (!node) {
      return;
    }

    const settings = node.data.settings;
    if (!settings.columnName) {
      updateNodeData('dataFrame', undefined);
      return;
    }

    const column = sourceDataFrame?.columns.find((c) => c.name === settings.columnName);
    if (!column) {
      updateNodeData('dataFrame', undefined);
      return;
    }

    const nodeDataFrame = sourceDataFrame?.oneHotEncoder(settings.columnName, settings.dropFirst);
    updateNodeData('dataFrame', nodeDataFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node?.data.settings, sourceDataFrame]);

  return (
    <NodeBase nodeId={id} nodeTypeName={t('nodes.oneHotEncoder.title')}>
      <StyledHandle type="target" position={Position.Left} />
      <StyledHandle type="source" position={Position.Right} />
    </NodeBase>
  );
};
