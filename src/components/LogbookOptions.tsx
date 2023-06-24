import React, { ReactElement } from "react";
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
type LogbookOptionsProps = {
  timeframe: number;
  handleTimeframeChange: (tf: number | string) => void;
  climbType: string;
  setClimbType: (ct: string) => void;
  chartType: string;
  gradeOptions?: string[];
  selectedFilterGrades: string[];
  setSelectedFilterGrades: (grades: string[]) => void;
  handleChartTypeChange: (btn: HTMLButtonElement) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const getStyles = (grade: string, filterGrades: readonly string[], theme: Theme) => {
  return {
    fontWeight:
      filterGrades.indexOf(grade) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
};

const LogbookOptions = (props: LogbookOptionsProps): ReactElement => {

  const {
    timeframe, handleTimeframeChange, climbType, setClimbType, chartType, handleChartTypeChange, gradeOptions,
    selectedFilterGrades, setSelectedFilterGrades
  } = props;
  const theme = useTheme();

  const handleGradeFilterChange = (event: SelectChangeEvent<typeof selectedFilterGrades>) => {
    const { target: { value } } = event;
    setSelectedFilterGrades(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <ToggleButtonGroup
        color="primary"
        value={chartType}
        exclusive
        onChange={({ target }) => handleChartTypeChange(target as HTMLButtonElement)}
        sx={{ ml:1, mr: 4, height: '56px' }}
      >
        <ToggleButton value="date">Date series</ToggleButton>
        <ToggleButton value="pyramid">Pyramid</ToggleButton>
      </ToggleButtonGroup>
      <FormControl>
        <InputLabel>Timeframe</InputLabel>
        <Select
          value={timeframe}
          label="Timeframe"
          onChange={({ target }) => handleTimeframeChange(target.value)}
          sx={{mx: 1, minWidth: '120px'}}
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
          value={climbType}
          label="Style"
          onChange={({ target }) => setClimbType(target.value.toString())}
          sx={{mx: 1, minWidth: '120px'}}
        >
          <MenuItem value={'boulder'}>Boulder</MenuItem>
          <MenuItem value={'sport'}>Sport climbing</MenuItem>
        </Select>
      </FormControl>
      {gradeOptions && (
        <FormControl>
          <InputLabel>Grade</InputLabel>
          <Select
            multiple
            value={selectedFilterGrades}
            onChange={handleGradeFilterChange}
            input={<OutlinedInput label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
            sx={{mx: 1, minWidth: '120px'}}
          >
            {gradeOptions.map((grade) => (
              <MenuItem
                key={grade}
                value={grade}
                style={getStyles(grade, selectedFilterGrades, theme)}
              >
                {grade}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {gradeOptions && !!selectedFilterGrades.length && (
        <ClearIcon
          sx={{ cursor: 'pointer', ml: 1, pt: 1, width: '0.8em' }}
          onClick={() => setSelectedFilterGrades([])}
        />
      )}
    </div>
  );
};

export default LogbookOptions;