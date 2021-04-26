import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';

const columns = [
    { id: 'order_number', label: 'Order No.', minWidth: 100, align: 'right' },
    { id: 'detail', label: 'Detail', minWidth: 300 },
    { id: 'customer_name', label: 'Name', minWidth: 200 },
    { id: 'customer_address', label: 'Address', minWidth: 300 },
    { id: 'customer_phone_number', label: 'Phone Number', minWidth: 150 },
    { id: 'status', label: 'Status', minWidth: 100 },
];

const useStyles = makeStyles({
    tableRow: {
      height: 40,
    },
    tableCell: {
      padding: "0px 16px"
    },
    root: {
      width: '90%',
    },
    container: {
      maxHeight: 400,
    },
});

const PaidTable = (props) => {
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

  return (
    <Paper className={classes.root}>
        <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow className={classes.tableRow}>
                        {columns.map((column) => (
                            <TableCell className={classes.tableCell}
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                            >
                            {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.order_number} className={classes.tableRow}>
                        {columns.map((column) => {
                            const value = row[column.id];
                            return (
                            <TableCell className={classes.tableCell} key={column.id} align={column.align}>
                                {column.format && typeof value === 'number' ? column.format(value) : value}
                            </TableCell>
                            );
                        })}
                        </TableRow>
                    );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={props.rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
        />
    </Paper>
  );
};

export default PaidTable;
