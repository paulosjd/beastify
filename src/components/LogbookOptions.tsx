import React, { ReactElement } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

type LogbookOptionsProps = {
  timeframe: number;
  handleTimeframeChange: (tf: number | string) => void;
  climbType: string;
  setClimbType: (ct: string) => void;
  chartType: string;
  handleChartTypeChange: (btn: HTMLButtonElement) => void;
}

const LogbookOptions = (props: LogbookOptionsProps): ReactElement => {

  const { timeframe, handleTimeframeChange, climbType, setClimbType, chartType, handleChartTypeChange } = props;

  return (
    <div>
      <FormControl>
        <InputLabel>Timeframe</InputLabel>
        <Select
          sx={{mx: 1, minWidth: '120px'}}
          value={timeframe}
          label="Timeframe"
          onChange={({ target }) => handleTimeframeChange(target.value)}
        >
          <MenuItem value={0.5}>6 Months</MenuItem>
          <MenuItem value={1}>1 year</MenuItem>
          <MenuItem value={3}>3 years</MenuItem>
          <MenuItem value={5}>5 years</MenuItem>
          <MenuItem value={10}>10 years</MenuItem>
          <MenuItem value={0}>All</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Style</InputLabel>
        <Select
          sx={{mx: 1, minWidth: '120px'}}
          value={climbType}
          label="Style"
          onChange={({ target }) => setClimbType(target.value.toString())}
        >
          <MenuItem value={'boulder'}>Boulder</MenuItem>
          <MenuItem value={'sport'}>Sport climbing</MenuItem>
        </Select>
      </FormControl>
      <ToggleButtonGroup
        color="primary"
        value={chartType}
        exclusive
        onChange={({ target }) => handleChartTypeChange(target as HTMLButtonElement)}
        sx={{ ml:1, height: '56px' }}
      >
        <ToggleButton value="date">Date series</ToggleButton>
        <ToggleButton value="pyramid">Pyramid</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

export default LogbookOptions;