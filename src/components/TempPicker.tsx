import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

type TempPickerProps = {
  minTempValue: number;
  maxTempValue: number;
  setMinTempValue: (val: number) => void;
  setMaxTempValue: (val: number) => void;
};

const marks = [
  {
    value: 0,
    label: '0°C',
  },
  {
    value: 5,
    label: '5°C',
  },
  {
    value: 10,
    label: '10°C',
  },
  {
    value: 15,
    label: '15°C',
  },
  {
    value: 20,
    label: '20°C',
  },
  {
    value: 25,
    label: '25°C',
  },
];

const valuetext = (value: number) => {
  return `${value}°C`;
};

const TempPicker = ({ minTempValue, maxTempValue, setMinTempValue, setMaxTempValue }: TempPickerProps) => {

  const handleChange = (_ : Event, value: number | number[]) => {
    if (Array.isArray(value)) {
      setMinTempValue(value[0]);
      setMaxTempValue(value[1]);
    }
  };

  return (
    <Box sx={{ width: 300, ml: 6 }}>
      <Typography id="input-slider" sx={{ml: 3, color: '#717171'}}>
        Temp. range
      </Typography>
      <Slider
        aria-label="Always visible"
        value={[minTempValue, maxTempValue]}
        onChange={handleChange}
        getAriaValueText={valuetext}
        step={1}
        marks={marks}
        max={25}
        valueLabelDisplay="on"
      />
    </Box>
  );
};

export default TempPicker;