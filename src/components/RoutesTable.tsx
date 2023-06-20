import React, { ReactElement } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { LogItem } from "../lib/types";

type GradePyramidProps = {
  tableData: LogItem[];
};

const RoutesTable = ({ tableData }: GradePyramidProps): ReactElement => {

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 1200, mt: 2 }} >
      <Table>
        <TableHead>
          <TableRow>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row) => (
            <TableRow
              key={row.route}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{row.route}</TableCell>
              <TableCell sx={{textAlign: 'left'}}>{row.grade}</TableCell>
              <TableCell align="right">{row.crag}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RoutesTable;