import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

type TempPickerProps = {
  value: string;
  onChange: (val: number) => void;
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

// TODO make into range picker so set min and max on same instead of 2 different sliders

const TempPicker = ({ value, onChange }: TempPickerProps) => {

  const handleChange = (evt: Event, val: number) => {
    console.log(val)
    onChange(val)
    // if (e.target?.value) {
    //   console.log(e.target.value)
    //   onChange(e.target.value)
    // }
  };

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        aria-label="Always visible"
        value={parseInt(value)}
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