import React, { Fragment, ReactElement, useContext, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import EditIcon from '@mui/icons-material/Edit';
import NotesIcon from '@mui/icons-material/Notes';
import styled from "styled-components";
import { AppContext } from "../AppContext";
import { LogItem, SavedLogItemNotesType } from "../lib/types";
import TextArea from "./TextArea";
import Button from "./Button";

const RouteSpan = styled.span`
  cursor: pointer;
`;

const SavedNotesText = styled.p`
  margin: 5px 0 0 15px;
  color: #333;
`;

const NotesTextArea = styled(TextArea)`
  padding: 18px 0 0 20px;
`;

type RoutesTableProps = {
  tableData: LogItem[];
  selectedLogItem: string;
  setSelectedLogItem: (itemId: string) => void;
};

const RoutesTable = (props: RoutesTableProps): ReactElement => {

  const { tableData, selectedLogItem, setSelectedLogItem } = props;
  const [isEditNotes, setIsEditNotes] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const {
    addLogItemNotes, updateLogItemNotes, deleteLogItemNotes, getLogItemNotes, logItemNotes
  } = useContext(AppContext);

  useEffect(() => {
    getLogItemNotes();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleEsc = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        if (isEditNotes) {
          setIsEditNotes(false);
        } else {
          setSelectedLogItem('');
        }
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
    setNotes('');
    setIsEditNotes(false);
  };

  const handleSaveNotes = async (logItemId: string, notesDocId: string) => {
    const data = { logItemId, notes };
    if (isEditNotes) {
      if (!notes) {
        await deleteLogItemNotes(notesDocId);
        setSelectedLogItem('');
      } else {
        await updateLogItemNotes({ ...data, id: notesDocId });
      }
    } else {
      await addLogItemNotes(data);
    }
    setIsEditNotes(false);
    getLogItemNotes();
  }

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 1200, mt: 2 }} >
      <Table>
        <TableHead>
          <TableRow>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row) => (
            <Fragment key={row.route}>
              <TableRow
                sx={selectedLogItem === row.id ? { '& td': { border: 0 } } : {}}
              >
                <TableCell>
                  <RouteSpan
                    onClick={() => toggleViewItem(row.id)}
                  >
                    {row.route}
                    {Object.keys(logItemNotes).includes(row.id) && (
                      <NotesIcon
                        sx={{ cursor: 'pointer', ml: 2, verticalAlign: 'bottom' }}
                        onClick={() => toggleViewItem(row.id)}
                      />
                    )}
                  </RouteSpan>
                </TableCell>
                <TableCell sx={{textAlign: 'left'}}>{row.grade}</TableCell>
                <TableCell align='right'>{row.crag}</TableCell>
              </TableRow>
              {selectedLogItem === row.id && (
                <TableRow>
                  <TableCell colSpan={3} sx={{ pt: 0 }}>
                    {Object.keys(logItemNotes).includes(row.id) && !isEditNotes ? (
                      <div style={{display: 'flex'}}>
                        <EditIcon
                          sx={{ cursor: 'pointer', ml: 2, verticalAlign: 'bottom', width: '0.6em' }}
                          onClick={() => {
                            setNotes(logItemNotes[row.id].notes)
                            setIsEditNotes(true);
                          }}
                        />
                        <SavedNotesText>{logItemNotes[row.id].notes}</SavedNotesText>
                      </div>
                    ) : (
                      <>
                        <NotesTextArea
                          value={notes}
                          name="notes"
                          placeholder="Notes"
                          onChange={({ target }) => setNotes(target.value)}
                        />
                        <Button
                          disabled={!notes && !isEditNotes}
                          onClick={() => handleSaveNotes(row.id, logItemNotes[row.id]?.id || '')}
                        >
                          Save
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RoutesTable;