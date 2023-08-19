import React, { useContext, useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';
import { FormButton } from "./StyledComponents";
import styles from "./styles.module.css";
import styled from "styled-components";
import { AppContext } from "../AppContext";

type SettingsDialogProps = {
  open: boolean;
  onClose: () => void;
};

const ButtonContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SaveButton = styled(FormButton)`
  margin: 22px 0 5px 0;
`;

const SettingsDialog = (props: SettingsDialogProps) => {
  const { onClose, open } = props;

  const {
    sheetIdConfigData, currentUser, getSheetIdConfigData, addSheetIdConfig, updateSheetIdConfig
  } = useContext(AppContext);

  const [bodyWeightSheetId, setBodyweightSheetId] = useState<string>('');
  const [logbookSheetId, setLogbookSheetId] = useState<string>('');
  const [pullupsSheetId, setPullupsSheetId] = useState<string>('');

  useEffect(() => {
    // getSheetIdConfigData();
    setBodyweightSheetId(sheetIdConfigData.bodyWeightSheetId || '');
    setLogbookSheetId(sheetIdConfigData.logbookSheetId || '');
    setPullupsSheetId(sheetIdConfigData.pullupsSheetId || '');
    // eslint-disable-next-line
  }, [sheetIdConfigData]);

  const handleSubmit = async () => {
    if (sheetIdConfigData.id) {
      await updateSheetIdConfig({ id: sheetIdConfigData.id, pullupsSheetId, logbookSheetId, bodyWeightSheetId })
    } else {
      await addSheetIdConfig({ pullupsSheetId, logbookSheetId, bodyWeightSheetId })
    }
    onClose();
    await getSheetIdConfigData();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle className={styles.lgDialog} sx={{ pb: 2 }} >Google Sheet IDs</DialogTitle>
      <Box sx={{ px: 2, pb: 2 }}>
        <FormControl fullWidth>
          <TextField
            label="Bodyweight Sheet ID"
            variant="outlined"
            value={bodyWeightSheetId}
            onChange={({ target }) => setBodyweightSheetId(target.value)}
          />
          <TextField
            label="Logbook Sheet ID"
            variant="outlined"
            value={logbookSheetId}
            onChange={({ target }) => setLogbookSheetId(target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Weighted Pullups Sheet ID"
            variant="outlined"
            value={pullupsSheetId}
            onChange={({ target }) => setPullupsSheetId(target.value)}
            sx={{ mt: 2 }}
          />
          <ButtonContainer>
            <SaveButton onClick={handleSubmit}>
              Save
            </SaveButton>
          </ButtonContainer>
        </FormControl>
      </Box>
    </Dialog>
  );
}

export default SettingsDialog;