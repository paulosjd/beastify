import React, { ReactElement, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import NotesIcon from '@mui/icons-material/Notes';
import styled from "styled-components";
import { LogItem, SavedLogItemNotesType } from "../lib/types";

const RouteSpan = styled.span`
  cursor: pointer;
`;

type RoutesTableProps = {
  tableData: LogItem[];
  selectedLogItem: string;
  setSelectedLogItem: (itemId: string) => void;
  savedLogItemNotes: SavedLogItemNotesType[];
};

const RoutesTable = (props: RoutesTableProps): ReactElement => {

  const { tableData, selectedLogItem, setSelectedLogItem, savedLogItemNotes } = props;

  useEffect(() => {
    const handleEsc = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        setSelectedLogItem('');
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
    // eslint-disable-next-line
  }, []);

  const toggleViewItem = (itemId: string) => {
    const value = selectedLogItem === itemId ? '' : itemId;
    setSelectedLogItem(value);
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 1200, mt: 2 }} >
      <Table>
        <TableHead>
          <TableRow>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row) => (
            <>
              <TableRow
                key={row.route}
                sx={selectedLogItem === row.id ? { '& td': { border: 0 } } : {}}
              >
                <TableCell>
                  <RouteSpan
                    onClick={() => toggleViewItem(row.id)}
                  >
                    {row.route}
                    <NotesIcon
                      sx={{ cursor: 'pointer', ml: 2, verticalAlign: 'bottom' }}
                      onClick={() => toggleViewItem(row.id)}
                    />
                  </RouteSpan>
                </TableCell>
                <TableCell sx={{textAlign: 'left'}}>{row.grade}</TableCell>
                <TableCell align='right'>{row.crag}</TableCell>
              </TableRow>
              {selectedLogItem === row.id && (
                <TableRow>
                  <TableCell colSpan={3} sx={{ pt: 0 }}>sdf</TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RoutesTable;