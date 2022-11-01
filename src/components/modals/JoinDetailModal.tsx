import { Button, MenuItem } from '@mui/material';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useOpenModalNode } from '../../hooks/nodes';
import { ModalType } from '../../models/modal';
import { JoinNode, JoinNodeSetting, JoinType } from '../../models/joinNode';
import { edgesState, nodesState, openModalState } from '../../store/atoms';
import { Form } from '../common/Form';
import { Modal } from '../common/Modal';
import { Select } from '../form/Select';

export const JoinDetailModal = () => {
  const { t } = useTranslation();

  const [nodes, setNodes] = useRecoilState(nodesState);
  const edges = useRecoilValue(edgesState);
  const [openModal, setOpenModal] = useRecoilState(openModalState);

  const node = useOpenModalNode() as JoinNode;

  const sourceDataA = useMemo(() => {
    const edge = edges.find((edge) => edge.target === node.id && edge.targetHandle == 'a');
    const sourceNodeId = edge?.source;
    const sourceNode = nodes.find((node) => node.id === sourceNodeId);

    return sourceNode?.data;
  }, [edges, nodes, node.id]);

  const sourceDataB = useMemo(() => {
    const edge = edges.find((edge) => edge.target === node.id && edge.targetHandle == 'b');
    const sourceNodeId = edge?.source;
    const sourceNode = nodes.find((node) => node.id === sourceNodeId);

    return sourceNode?.data;
  }, [edges, nodes, node.id]);

  const { control, handleSubmit } = useForm<JoinNodeSetting>({
    defaultValues: node.settings,
  });

  const onSubmit = (settings: JoinNodeSetting) => {
    setNodes([
      ...nodes.filter((node) => node.id !== openModal?.nodeId),
      { ...node, settings } as JoinNode,
    ]);

    setOpenModal(null);
  };

  return (
    <Modal
      title={t('nodes.join.title')}
      open={openModal?.modalType == ModalType.Detail}
      onClose={() => setOpenModal(null)}
    >
      {sourceDataA && sourceDataB ? (
        <Form>
          <Select name="columnA" control={control} label={t('nodes.join.columnA')}>
            {sourceDataA?.columns.map((columnName, index) => (
              <MenuItem key={index} value={columnName}>
                {columnName}
              </MenuItem>
            ))}
          </Select>
          <Select name="columnB" control={control} label={t('nodes.join.columnB')}>
            {sourceDataB?.columns.map((columnName, index) => (
              <MenuItem key={index} value={columnName}>
                {columnName}
              </MenuItem>
            ))}
          </Select>
          <Select name="type" control={control} label={t('nodes.join.type')}>
            <MenuItem value={JoinType.innerJoin}>{t('nodes.join.types.innerJoin')}</MenuItem>
            <MenuItem value={JoinType.leftOuterJoin}>
              {t('nodes.join.types.leftOuterJoin')}
            </MenuItem>
            <MenuItem value={JoinType.rightOuterJoin}>
              {t('nodes.join.types.rightOuterJoin')}
            </MenuItem>
            <MenuItem value={JoinType.fullOuterJoin}>
              {t('nodes.join.types.fullOuterJoin')}
            </MenuItem>
          </Select>

          <Button variant="outlined" onClick={handleSubmit(onSubmit)}>
            {t('common.save')}
          </Button>
        </Form>
      ) : (
        <>{t('detailModal.selectDataSource')}</>
      )}
    </Modal>
  );
};

