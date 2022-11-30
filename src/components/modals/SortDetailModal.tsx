import { Button, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../hooks/modal';
import { useSourceDataFrame, useUpdateNodeData } from '../../hooks/node';
import { ModalType } from '../../models/modal';
import { SortNode, SortNodeSetting } from '../../models/sortNode';
import { Modal } from '../common/Modal';
import { Form } from '../common/styled';
import { Select } from '../form/Select';

export const SortDetailModal = () => {
  const { t } = useTranslation();

  const { node, openModalType, closeModal } = useModal<SortNode>();
  const updateNodeData = useUpdateNodeData<SortNode>(node?.id);
  const sourceDataFrame = useSourceDataFrame(node?.id);

  const { control, handleSubmit } = useForm<SortNodeSetting>({
    defaultValues: node?.data.settings,
  });

  const onSubmit = (settings: SortNodeSetting) => {
    updateNodeData('settings', settings);
    closeModal();
  };

  return (
    <Modal
      title={t('nodes.sort.title')}
      open={openModalType === ModalType.Detail}
      onClose={closeModal}
    >
      {sourceDataFrame ? (
        <Form>
          <Select name="sortColumn" control={control} label={t('nodes.sort.column')}>
            {sourceDataFrame?.columns.map((column, index) => (
              <MenuItem key={index} value={column.name}>
                {column.name}
              </MenuItem>
            ))}
          </Select>

          <Select name="direction" control={control} label={t('nodes.sort.direction')}>
            <MenuItem value="asc">{t('nodes.sort.asc')}</MenuItem>
            <MenuItem value="desc">{t('nodes.sort.desc')}</MenuItem>
          </Select>

          <Button variant="outlined" onClick={handleSubmit(onSubmit)}>
            {t('common.save')}
          </Button>
        </Form>
      ) : (
        t('detailModal.selectDataSource')
      )}
    </Modal>
  );
};
