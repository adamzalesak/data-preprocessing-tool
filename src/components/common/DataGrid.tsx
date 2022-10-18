import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { memo, useMemo, useState } from 'react';
import { DataFrame } from '../../classes/DataFrame';
import { TABLE_ROWS_PER_PAGE_OPTIONS } from '../../constants';

interface Props {
  data: DataFrame;
}

export const DataGrid = memo(({ data }: Props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROWS_PER_PAGE_OPTIONS[0]);

  const rows = useMemo(
    () => data?.rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
    [data, page, rowsPerPage],
  );

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    setPage(page);
  };

  const handleChangeRowsPerPage: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // TODO: maxHeight - fix

  return (
    <Paper>
      <TableContainer sx={{ maxHeight: '75vh' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {data?.columns.map((x, index) => (
                <TableCell key={index}>{x}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {data?.columns.map((x, index) => (
                  <TableCell key={index}>{row[x]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={TABLE_ROWS_PER_PAGE_OPTIONS}
        colSpan={3}
        count={data.count}
        rowsPerPage={rowsPerPage}
        page={page}
        SelectProps={{
          inputProps: {
            'aria-label': 'rows per page',
          },
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
});

