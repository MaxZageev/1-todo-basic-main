import React from 'react';
import { Box, TablePagination } from '@mui/material';
import type { PaginationControlsProps } from '../../types/components';

/**
 * PaginationControls: обёртка над MUI TablePagination, показывающая диапазон задач и выбор количества на странице.
 */
const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  total,
  totalPages,
  limit,
  limitOptions,
  onChangePage,
  onChangeLimit,
}) => {
  const safeTotalPages = Math.max(totalPages, 1);
  const clampedPage = Math.min(page, safeTotalPages);
  const pageIndex = Math.max(clampedPage - 1, 0);

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement> | null,
    nextPage: number,
  ) => {
    onChangePage(nextPage + 1);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChangeLimit(Number(event.target.value));
  };

  const labelDisplayedRows = ({ from, to, count }: { from: number; to: number; count: number }) => {
    if (count === 0) {
      return 'Задач нет';
    }
    if (count === -1) {
      return `${from}-${to} из более чем ${to}`;
    }
    return `${from}-${to} из ${count}`;
  };

  return (
    <Box display="flex" justifyContent="center" sx={{ width: "100%" }}>
      <TablePagination
        component="div"
        count={total}
        page={pageIndex}
        onPageChange={handleChangePage}
        rowsPerPage={limit}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={limitOptions}
        labelRowsPerPage="Задач на странице"
        labelDisplayedRows={labelDisplayedRows}
      />
    </Box>
  );
};

export default PaginationControls;
