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
  settingsDialogType: string;
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
  const { onClose, settingsDialogType } = props;

  const {
    userConfig, currentUser, getUserConfig, addSheetIdConfig, updateSheetIdConfig
  } = useContext(AppContext);

  const [bodyWeightSheetId, setBodyweightSheetId] = useState<string>('');
  const [logbookSheetId, setLogbookSheetId] = useState<string>('');
  const [pullupsSheetId, setPullupsSheetId] = useState<string>('');
  const [mapCenterLat, setMapCenterLat] = useState<string>('');
  const [mapCenterLon, setMapCenterLon] = useState<string>('');
  const [mapZoom, setMapZoom] = useState<string>('');
  const [errorFieldName, setErrorFieldName] = useState<string>('');


  useEffect(() => {
    setBodyweightSheetId(userConfig.bodyWeightSheetId || '');
    setLogbookSheetId(userConfig.logbookSheetId || '');
    setPullupsSheetId(userConfig.pullupsSheetId || '');
    setMapCenterLat(userConfig.mapCenterLat || '');
    setMapCenterLon(userConfig.mapCenterLon || '');
    setMapZoom(userConfig.mapZoom || '');
  }, [userConfig, settingsDialogType]);

  const handleSubmit = async () => {
    if (settingsDialogType === 'mapCenter') {
      if (mapCenterLat && parseFloat(mapCenterLat) && (parseFloat(mapCenterLat) < 50 || parseFloat(mapCenterLat) > 58)) {
        setErrorFieldName('mapCenterLat');
        return;
      }
      if (mapCenterLon && parseFloat(mapCenterLon) && (parseFloat(mapCenterLon) < -6 || parseFloat(mapCenterLon) > -1)) {
        setErrorFieldName('mapCenterLon');
        return;
      }
      if (mapZoom && parseInt(mapZoom) && (parseInt(mapZoom) < 1 || parseInt(mapZoom) > 100)) {
        setErrorFieldName('mapZoom');
        return;
      }
    }
    const configData = {
      pullupsSheetId,
      logbookSheetId,
      bodyWeightSheetId,
      mapCenterLat: isNaN(parseFloat(mapCenterLat)) ? '' : parseFloat(mapCenterLat).toString(),
      mapCenterLon: isNaN(parseFloat(mapCenterLon)) ? '' : parseFloat(mapCenterLon).toString(),
      mapZoom
    }
    if (userConfig.id) {
      await updateSheetIdConfig({ id: userConfig.id, ...configData })
    } else {
      await addSheetIdConfig(configData)
    }
    onClose();
    await getUserConfig();
  };

  const handleMapCenterInputChange = (value: string, setCenter: (geoVal: string) => void) => {
    setErrorFieldName('');
    if (value === '' || value === '-' || (/^-?(\d)*(\.)?([0-9]{1})?$/.test(value) && parseFloat(value) >= -90 && parseFloat(value) <= 90)) {
      setCenter(value);
    }
  };

  const handleMapZoomInputChange = (value: string) => {
    setErrorFieldName('');
    if (value === '' || (/^\d+$/.test(value) && value.length < 4)) {
      setMapZoom(value);
    }
  };

  return (
    <Dialog onClose={onClose} open={!!settingsDialogType}>
      <Box sx={{ px: 2, pb: 2 }}>
        <FormControl fullWidth>
          {settingsDialogType === 'sheetIds' && (
            <>
              <DialogTitle className={styles.lgDialog} sx={{ pb: 2, px: 1, fontSize: 18 }} >Google Sheet IDs</DialogTitle>
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
            </>
          )}
          {settingsDialogType === 'mapCenter' && (
            <>
              <DialogTitle className={styles.lgDialog} sx={{ pb: 2, px: 1, fontSize: 18 }} >Climbs Map Settings</DialogTitle>
              <TextField
                label="Center Latitude"
                variant="outlined"
                value={mapCenterLat}
                onChange={({ target }) => handleMapCenterInputChange(target.value, setMapCenterLat)}
                error={errorFieldName === 'mapCenterLat'}
                helperText={errorFieldName === 'mapCenterLat' && 'Enter a value between 50 and 58'}
              />
              <TextField
                label="Center Longitude"
                variant="outlined"
                value={mapCenterLon}
                onChange={({ target }) => handleMapCenterInputChange(target.value, setMapCenterLon)}
                error={errorFieldName === 'mapCenterLon'}
                helperText={errorFieldName === 'mapCenterLat' && 'Enter a value between -1 and -6'}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Zoom"
                variant="outlined"
                value={mapZoom}
                onChange={({ target }) => handleMapZoomInputChange(target.value)}
                error={errorFieldName === 'mapZoom'}
                helperText={errorFieldName === 'mapZoom' && 'Enter a value between 1 and 100'}
                sx={{ mt: 2 }}
              />
            </>
          )}
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