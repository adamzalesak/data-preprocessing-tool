import { ReactNode } from 'react';
import { useSetRecoilState } from 'recoil';
import { useNode, useSourceDataFrame } from '../../hooks/node';
import { ModalType } from '../../models/modal';
import { NodeState } from '../../models/dataNode';
import { openModalState } from '../../store/atoms';
import TableViewIcon from '@mui/icons-material/TableView';
import DownloadIcon from '@mui/icons-material/Download';
import { styled } from '@mui/material';

const NodeBox = styled('div')(
  ({ theme }) => `
  padding: 1rem;
  border: 1px solid ${theme.palette.primary.main};
  border-radius: 3px;
  background-color: ${theme.palette.primary.light};
`,
);

const DisplayDataButton = styled(TableViewIcon)`
  position: absolute;
  left: 0;
  bottom: 0;
  margin: 2px;
  font-size: 1rem;
  max-height: 1rem;
  max-width: 1rem;

  cursor: pointer;
`;

const DownloadButton = styled(DownloadIcon)`
  position: absolute;
  left: 1rem;
  bottom: 0;
  margin: 2px;
  font-size: 1rem;
  max-height: 1rem;
  max-width: 1rem;

  cursor: pointer;
`;

interface StateBadgeProps {
  state: NodeState;
}

const State = styled('div')<StateBadgeProps>`
  height: 0rem;
  width: 0rem;
  position: absolute;
  right: 0;
  bottom: 0;
  margin: 2px;

  border-style: solid;
  border-width: 0 0 0.75rem 0.75rem;
  border-color: transparent transparent
    ${(props) =>
      props.state === NodeState.Done
        ? props.theme.palette.success.main
        : props.state === NodeState.InvalidSettings
        ? props.theme.palette.warning.main
        : props.theme.palette.error.main}
    transparent;
`;

const RowColumnCount = styled('div')`
  position: absolute;
  right: 0;
  margin-top: -0.3rem;
  margin-bottom: auto;
  margin-left: auto;
  width: fit-content;
  font-size: 0.5rem;
  white-space: nowrap;
`;

interface BaseNodeProps {
  nodeId: string;
  nodeTypeName: string;
  children: ReactNode;
  state?: NodeState;
}

export const NodeBase = ({ nodeId, nodeTypeName, state, children }: BaseNodeProps) => {
  const node = useNode(nodeId);
  const sourceDataFrame = useSourceDataFrame(nodeId);
  const setOpenModal = useSetRecoilState(openModalState);

  const handleOpenDetail = () => {
    setOpenModal({ modalType: ModalType.Detail, nodeId });
  };

  const handleOpenPreview = () => {
    setOpenModal({ modalType: ModalType.Data, nodeId });
  };

  const nodeState =
    state !== undefined
      ? state
      : node?.data.dataFrame
      ? NodeState.Done
      : sourceDataFrame
      ? NodeState.InvalidSettings
      : NodeState.NoSource;

  return (
    <>
      <NodeBox onClick={handleOpenDetail}>
        <div>{nodeTypeName}</div>
        {!!node?.data.dataFrame && (
          <>
            <DisplayDataButton
              onClick={(event) => {
                event?.stopPropagation();
                handleOpenPreview();
              }}
            />
            <DownloadButton
              onClick={(event) => {
                event?.stopPropagation();
                node?.data.dataFrame?.toCSVFile();
              }}
            />
          </>
        )}

        <State state={nodeState} />
        {children}
      </NodeBox>
      {node?.data.dataFrame ? (
        <RowColumnCount>
          {node?.data.dataFrame?.count} rows; {node?.data.dataFrame?.columns?.length} columns
        </RowColumnCount>
      ) : null}
    </>
  );
};
