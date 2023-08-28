import React from "react";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import styled from "styled-components";
import Button from "./Button";
import Input from "./Input";
import { FlexStartRow, FormButton, Row } from "./StyledComponents";
import TextArea from "./TextArea";
import ClimbTypeRadioButtons from "./ClimbTypeRadioButtons";

const ClimbInputRow = styled(Row)`
  margin-bottom: 12px;
`;

const ClimbNotesTextArea = styled(TextArea)`
  height: 55px;
`;

const GradeInputLabel = styled(InputLabel)`
  width: 80px;
  margin: 18px 0 0 26px;
`;

type ClimbData = {
  newClimbName: string;
  newClimbGrade: string;
  newClimbNotes: string;
  newClimbType: string;
};

type ClimbFormProps = {
  newClimbData: ClimbData;
  setNewClimbData: (val: string, inputType: string) => void;
  resetClimbForm: () => void;
  handleNewClimbSubmit: () => void;
};

const ClimbForm = (props: ClimbFormProps) => {

  const {
    newClimbData: { newClimbType, newClimbName, newClimbGrade, newClimbNotes },
    setNewClimbData, resetClimbForm, handleNewClimbSubmit
  } = props;

  const gradeOptions = [];
  let gradeList = ['6b', '6c', '7a', '7b', '7c', '8a', '8b'];
  if (newClimbType === 'boulder') {
    gradeList.unshift('6a');
    gradeList = gradeList.map(i => `f${i}`);
  }
  for (let grade of gradeList) {
    gradeOptions.push(grade);
    gradeOptions.push(`${grade}+`);
  }

  return (
    <>
      <ClimbTypeRadioButtons
        defaultValue={'boulder'}
        setNewClimbType={val => setNewClimbData(val, 'type')}
      />
      <ClimbInputRow>
        <Input
          value={newClimbName}
          name="climbName"
          placeholder="Name"
          onChange={({ target }) => setNewClimbData(target.value, 'name')}
        />
        <GradeInputLabel sx={ {fontSize: 13} }>Grade</GradeInputLabel>
        <Select
          value={newClimbGrade}
          onChange={({ target }) => setNewClimbData(target.value.toString(), 'grade')}
          sx={{ minWidth: '420px' }}
        >
          {gradeOptions.map(i => (<MenuItem key={i} value={i}>{i}</MenuItem>))}
        </Select>
      </ClimbInputRow>
      <ClimbNotesTextArea
        value={newClimbNotes}
        name="climbNotes"
        placeholder="Notes"
        onChange={({ target }) => setNewClimbData(target.value, 'notes')}
      />
      <FlexStartRow>
        <FormButton onClick={() => resetClimbForm()}>
          Cancel
        </FormButton>
        <FormButton
          disabled={!newClimbName || !newClimbGrade}
          onClick={handleNewClimbSubmit}
        >
          Save
        </FormButton>
      </FlexStartRow>
    </>
  )
}

export default ClimbForm;