import { styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  getInitialFileNode,
  getInitialFilterNode,
  getInitialJoinNode,
  getInitialMinMaxScalerNode,
  getInitialOneHotEncoderNode,
  getInitialSimpleImputerNode,
  getInitialSliceNode,
  getInitialSortNode,
  getInitialStandardScalerNode,
} from '../../initialNodes';
import { DataNode } from '../../models/dataNode';
import { NodeType } from '../../models/nodeTypes';
import { nodeCountState, nodesState, openModalState } from '../../store/atoms';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';

const CardsContainer = styled('div')`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const AddNodeModal = () => {
  const { t } = useTranslation();

  const setOpenModal = useSetRecoilState(openModalState);
  const setNodes = useSetRecoilState(nodesState);
  const [nodeCount, setNodeCount] = useRecoilState(nodeCountState);

  const handleAddNode = (nodeType: NodeType) => {
    const nodeCountString = nodeCount.toString();

    let newNode: DataNode;
    switch (nodeType) {
      case NodeType.File: {
        newNode = getInitialFileNode(nodeCountString);
        break;
      }
      case NodeType.Sort: {
        newNode = getInitialSortNode(nodeCountString);
        break;
      }
      case NodeType.Filter: {
        newNode = getInitialFilterNode(nodeCountString);
        break;
      }
      case NodeType.Join: {
        newNode = getInitialJoinNode(nodeCountString);
        break;
      }
      case NodeType.Slice: {
        newNode = getInitialSliceNode(nodeCountString);
        break;
      }
      case NodeType.SimpleImputer: {
        newNode = getInitialSimpleImputerNode(nodeCountString);
        break;
      }
      case NodeType.MinMaxScaler: {
        newNode = getInitialMinMaxScalerNode(nodeCountString);
        break;
      }
      case NodeType.StandardScaler: {
        newNode = getInitialStandardScalerNode(nodeCountString);
        break;
      }
      case NodeType.OneHotEncoder: {
        newNode = getInitialOneHotEncoderNode(nodeCountString);
        break;
      }
    }

    setNodes((nodes) => [...nodes, newNode]);
    setNodeCount((nodeCount) => nodeCount + 1);
    setOpenModal(null);
  };

  return (
    <Modal title={t('addNode.title')} open={true} onClose={() => setOpenModal(null)}>
      <CardsContainer>
        <Card
          title={t('nodes.file.title')}
          description={t('nodes.file.description')}
          onClick={() => handleAddNode(NodeType.File)}
        />
        <Card
          title={t('nodes.sort.title')}
          description={t('nodes.sort.description')}
          onClick={() => handleAddNode(NodeType.Sort)}
        />
        <Card
          title={t('nodes.filter.title')}
          description={t('nodes.filter.description')}
          onClick={() => handleAddNode(NodeType.Filter)}
        />
        <Card
          title={t('nodes.join.title')}
          description={t('nodes.join.description')}
          onClick={() => handleAddNode(NodeType.Join)}
        />
        <Card
          title={t('nodes.slice.title')}
          description={t('nodes.slice.description')}
          onClick={() => handleAddNode(NodeType.Slice)}
        />
        <Card
          title={t('nodes.simpleImputer.title')}
          description={t('nodes.simpleImputer.description')}
          onClick={() => handleAddNode(NodeType.SimpleImputer)}
        />
        <Card
          title={t('nodes.minMaxScaler.title')}
          description={t('nodes.minMaxScaler.description')}
          onClick={() => handleAddNode(NodeType.MinMaxScaler)}
        />
        <Card
          title={t('nodes.standardScaler.title')}
          description={t('nodes.standardScaler.description')}
          onClick={() => handleAddNode(NodeType.StandardScaler)}
        />
        <Card
          title={t('nodes.oneHotEncoder.title')}
          description={t('nodes.oneHotEncoder.description')}
          onClick={() => handleAddNode(NodeType.OneHotEncoder)}
        />
      </CardsContainer>
    </Modal>
  );
};
