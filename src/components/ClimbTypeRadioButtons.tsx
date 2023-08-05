import React from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

type ClimbTypeProps = {
  defaultValue: string;
  setNewClimbType: (climbType: string) => void;
};

const ClimbTypeRadioButtons = (props: ClimbTypeProps) => {

  const { defaultValue, setNewClimbType } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewClimbType(event.target.value);
  };

  return (
    <RadioGroup
      row
      defaultValue={defaultValue}
      name="climb-type"
      onChange={handleChange}
    >
      <FormControlLabel value="boulder" control={<Radio/>} label="Boulder"/>
      <FormControlLabel value="route" control={<Radio/>} label="Route"/>
    </RadioGroup>
  );
}


export default ClimbTypeRadioButtons;