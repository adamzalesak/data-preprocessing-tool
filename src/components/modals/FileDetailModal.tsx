import { LoadingButton } from '@mui/lab';
import { ChangeEventHandler, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DataFrame } from '../../DataFrame/DataFrame';
import { useModal } from '../../hooks/modal';
import { useUpdateNodeData } from '../../hooks/node';
import { FileNode, FileNodeSettings } from '../../models/fileNode';
import { Modal } from '../common/Modal';
import { FormContainer } from '../common/form/styled';
import { TextField } from '../common/form/TextField';

export const FileDetailModal = () => {
  const { t } = useTranslation();

  const { node, closeModal } = useModal<FileNode>();
  const updateNodeData = useUpdateNodeData<FileNode>(node?.id);

  const { control, getValues } = useForm<FileNodeSettings>({ defaultValues: node?.data.settings });
  const fileRef = useRef<HTMLInputElement>(null);

  const isParsing = node?.data.isParsing ?? false;

  const handleFileChange: ChangeEventHandler = async (event) => {
    updateNodeData('isParsing', true);

    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    const dataFrame = await DataFrame.fromCSVFile(file, getValues().rowsLimit);

    updateNodeData('dataFrame', dataFrame);
    updateNodeData('fileName', file.name);

    resetFileInput();

    updateNodeData('isParsing', false);
  };

  const resetFileInput = () => {
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  const dataCount = node?.data.dataFrame?.count;

  return (
    <Modal title={t('nodes.file.title')} open onClose={closeModal}>
      <FormContainer>
        <TextField
          name="rowsLimit"
          type="number"
          label={t('nodes.file.rowsLimit')}
          control={control}
        />
        <LoadingButton
          variant="outlined"
          onClick={() => fileRef.current?.click()}
          loading={isParsing}
        >
          {t('nodes.file.selectFile')}
        </LoadingButton>
        <input hidden type="file" accept=".csv" onChange={handleFileChange} ref={fileRef} />
        <div>{node?.data.fileName}</div>
        {!!dataCount && <div>{dataCount} rows </div>}
      </FormContainer>
    </Modal>
  );
};
