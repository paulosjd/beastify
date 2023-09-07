import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

import { SxProps } from "@mui/material";


type TempPickerProps = {
  minTemp?: number;
  maxTemp?: number;
  temp?: number;
  setMinTemp?: (val: number) => void;
  setMaxTemp?: (val: number) => void;
  setTemp?: (val: number) => void;
  sxProps?: SxProps;
  single?: boolean;
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

const TempPicker = ({ minTemp, maxTemp, temp, setMinTemp, setMaxTemp, setTemp, sxProps, single }: TempPickerProps) => {

  const handleChange = (_ : Event, value: number | number[]) => {
    if (Array.isArray(value) && setMaxTemp && setMinTemp) {
      setMinTemp(value[0]);
      setMaxTemp(value[1]);
    }
    if (setTemp && typeof value === 'number') {
      setTemp(value);
    }
  };

  const value = (minTemp || minTemp === 0) && (maxTemp || maxTemp === 0) ? [minTemp, maxTemp] : temp;

  return (
    <Box sx={sxProps}>
      <Typography sx={{ color: '#717171' }}>
        {single ? 'Temperature' : 'Temp. range'}
      </Typography>
      <Slider
        value={value}
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