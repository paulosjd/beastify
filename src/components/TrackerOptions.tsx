import React, {ReactElement, useState} from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import ClearIcon from '@mui/icons-material/Clear';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import { Theme, useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import MonitorWeight from '@mui/icons-material/MonitorWeight';
import Button from "@mui/material/Button";


type TrackerOptionsProps = {
  chartType: string;
  setChartType: (val: string) => void;
}

const TrackerOptions = (props: TrackerOptionsProps): ReactElement => {

  const {
    chartType, setChartType
  } = props;

  const handleChartTypeChange = (target: HTMLButtonElement) => {
    setChartType(target.value);
  }

  return (
    <div>
      <ToggleButtonGroup
        color="primary"
        value={chartType}
        exclusive
        onChange={({ target }) => handleChartTypeChange(target as HTMLButtonElement)}
        sx={{ ml:1, mr: 4, height: '56px' }}
      >
        <ToggleButton value="absolute">Absolute</ToggleButton>
        <ToggleButton value="bodyWeight">% Body weight</ToggleButton>
      </ToggleButtonGroup>

    </div>
  );
};

export default TrackerOptions;