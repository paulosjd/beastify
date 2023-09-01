import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

type TempPickerProps = {
  minTemp: number;
  maxTemp: number;
  setMinTemp: (val: number) => void;
  setMaxTemp: (val: number) => void;
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

const TempPicker = ({ minTemp, maxTemp, setMinTemp, setMaxTemp }: TempPickerProps) => {

  const handleChange = (_ : Event, value: number | number[]) => {
    if (Array.isArray(value)) {
      setMinTemp(value[0]);
      setMaxTemp(value[1]);
    }
  };

  return (
    <Box sx={{ width: 300, ml: 6 }}>
      <Typography id="input-slider" sx={{ color: '#717171' }}>
        Temp. range
      </Typography>
      <Slider
        value={[minTemp, maxTemp]}
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