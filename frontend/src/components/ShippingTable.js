import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Input, IconButton } from '@material-ui/core';
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import { DataContext } from './DataContext';

const useStyles = makeStyles(theme => ({
    root: {
        width: "60%",
        marginTop: theme.spacing(3),
        overflowX: "auto"
    },
    table: {
        minWidth: 650
    },
    selectTableCell: {
        width: 120
    },
    tableCell: {
        width: 130,
        height: 40
    },
    input: {
        width: 130,
        height: 40
    }
}));

const CustomTableCell = ({ row, name, onChange }) => {
    const classes = useStyles();
    const { isEditMode } = row;
    return (
        <TableCell align="left" className={classes.tableCell}>
        {isEditMode ? (
            <Input
            value={row[name]}
            name={name}
            onChange={e => onChange(e, row)}
            className={classes.input}
            />
        ) : (
            row[name]
        )}
        </TableCell>
    );
};

function ShippingTable(props) {
    const [previous, setPrevious] = useState({});
    const classes = useStyles();
    const data = useContext(DataContext);

    const onToggleEditMode = parcel_number => {
        data.setParcelList(state => {
            return data.parcelList.map(row => {
                if (row.parcel_number === parcel_number) {
                    return { ...row, isEditMode: !row.isEditMode };
                }
                return row;
            });
        });
    };

    const onChange = (e, row) => {
        if (!previous[row.parcel_number]) {
            setPrevious(state => ({ ...state, [row.parcel_number]: row }));
        }
        const value = e.target.value;
        const name = e.target.name;
        const { parcel_number } = row;
        const newRows = data.parcelList.map(row => {
            if (row.parcel_number === parcel_number) {
                return { ...row, [name]: value };
            }
            return row;
        });
        data.setParcelList(newRows);
    };

    const onRevert = parcel_number => {
        const newRows = data.parcelList.map(row => {
        if (row.parcel_number === parcel_number) {
            return previous[parcel_number] ? previous[parcel_number] : row;
        }
        return row;
        });
        data.setParcelList(newRows);
        setPrevious(state => {
            delete state[parcel_number];
            return state;
        });
        onToggleEditMode(parcel_number);
    };

    return (
        <Paper className={classes.root}>
            <Table className={classes.table} aria-label="caption table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left" />
                        <TableCell align="left">Parcel Number</TableCell>
                        <TableCell align="left">Order Number</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {data.parcelList.map(row => (
                    <TableRow key={row.parcel_number}>
                        <TableCell className={classes.selectTableCell}>
                            {row.isEditMode ? (
                                <>
                                    <IconButton aria-label="done" onClick={() => onToggleEditMode(row.parcel_number)}>
                                        <DoneIcon />
                                    </IconButton>
                                    <IconButton aria-label="revert" onClick={() => onRevert(row.parcel_number)}>
                                        <RevertIcon />
                                    </IconButton>
                                </>
                            ) : (
                                <>
                                    <IconButton aria-label="delete" onClick={() => onToggleEditMode(row.parcel_number)}>
                                        <EditIcon />
                                    </IconButton>
                                </>
                            )}
                        </TableCell>
                        <CustomTableCell {...{ row, name: "parcel_number", onChange }} />
                        <CustomTableCell {...{ row, name: "order_number", onChange }} />
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default ShippingTable;
