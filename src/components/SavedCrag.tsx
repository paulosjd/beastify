import React, { ReactElement, useState } from "react";
import { Link, IconButton } from "@mui/material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import styled from "styled-components";
import Button from "./Button";
import Input from "./Input";
import { AppContext } from "../AppContext";
import { SavedTodoCragType } from "../lib/types";
import { Spacing } from "./StyledComponents";
import TextArea from "./TextArea";
import ConfirmDelete from "./ConfirmDelete";
import ClimbTypeRadioButtons from "./ClimbTypeRadioButtons";
import styles from "./styles.module.css";
import MenuItem from "@mui/material/MenuItem";
import { Stack, Typography } from "@mui/material";

const Wrapper = styled.div`
  width: 100%;
  margin-top: 1px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  text-align: left;
`;

export const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const ClimbInputRow = styled(Row)`
  margin-bottom: 12px;
`;

const ClimbNotesTextArea = styled(TextArea)`
  height: 55px;
`;

const ItemText = styled.p`
  margin: 0
`;

const AddClimbButton = styled(Button)`
  width: 200px;
  margin: 12px 0 10px 0;
  background-color: #1976d2;
`;

const GradeInputLabel = styled(InputLabel)`
  width: 80px;
  margin: 18px 0 0 26px;
  
`;

type SavedCragProps = {
  savedItem: SavedTodoCragType;
  editItemId: string;
  viewItemId: string;
  setViewItemId: (itemId: string) => void;
  setEditItemId: (itemId: string) => void;
};

export default function SavedCrag(props: SavedCragProps): ReactElement {
  const {
    savedItem: { id: itemId, name, geoCoordinates, conditions }, editItemId, setEditItemId, viewItemId, setViewItemId,
  } = props;
  const [conditionsValue, setConditionsValue] = useState<string>(conditions);
  const [geoCoordinatesValue, setGeoCoordinatesValue] = useState<string>(geoCoordinates);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
  const [isAddClimb, setIsAddClimb] = useState<boolean>(false);
  const [newClimbName, setNewClimbName] = useState<string>('');
  const [newClimbGrade, setNewClimbGrade] = useState<string>('');
  const [newClimbNotes, setNewClimbNotes] = useState<string>('');
  const [newClimbType, setNewClimbType] = useState<string>('boulder');
  const {
    updateSavedTodoCrag, deleteSavedItem, getSavedTodoCrags, addTodoClimb, getSavedTodoClimbs, savedTodoClimbs
  } = React.useContext(AppContext);
  const isView = viewItemId === itemId;
  const isEdit = editItemId === itemId;

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

  const viewToggle = () => {
    resetClimbForm();
    if (isView || isEdit) {
      setViewItemId('');
      setEditItemId('');
    } else {
      setViewItemId(itemId);
    }
  };

  const cancelEdit = () => {
    setEditItemId('');
    setViewItemId(itemId);
  };

  const resetClimbForm = () => {
    setIsAddClimb(false);
    setNewClimbGrade('');
    setNewClimbName('');
    setNewClimbNotes('');
  };

  const handleSave = () => {
    updateSavedTodoCrag({
      id: itemId,
      name,
      newGeocoordinates: geoCoordinatesValue,
      newConditions: conditionsValue
    });
    cancelEdit();
  };

  const handleDelete = async () => {
    await deleteSavedItem(itemId, 'todoCrag');
    await getSavedTodoCrags();
  };

  const handleNewClimbSubmit = async () => {
    await addTodoClimb({
      name: newClimbName,
      cragId: itemId,
      grade: newClimbGrade,
      notes: newClimbNotes
    });
    setNewClimbName('');
    setNewClimbGrade('');
    setNewClimbNotes('');
    cancelEdit();
    await getSavedTodoClimbs();
  }

  return (
    <Wrapper>
      <Row>
        <h4 className={`${styles.titleRowElem} ${styles.font18}`} onClick={viewToggle}>
          {name}
        </h4>
        <Spacing fitContent my="5px" float="right">
          <IconButton
            color="primary"
            component="label"
            onClick={viewToggle}
          >
            {isView || isEdit ? <ArrowDropUpIcon /> : <ExpandCircleDownIcon />}
          </IconButton>
        </Spacing>
        {isView ? (
          <>
            <Spacing fitContent my="5px" float="right">
              <Button
                onClick={() => {
                  resetClimbForm();
                  setEditItemId(itemId);
                  setViewItemId('');
                }}
              >
                Edit
              </Button>
            </Spacing>
          </>
        ) : isEdit ? (
          <>
            <Spacing fitContent my="5px" float="right">
              <Button onClick={cancelEdit}>
                Cancel
              </Button>
            </Spacing>
            <Spacing fitContent my="5px" float="right">
              <Button onClick={() => setOpenConfirmDelete(true)}>
                Delete
              </Button>
            </Spacing>
            <Spacing fitContent my="5px" float="right">
              <Button onClick={handleSave}>
                Save
              </Button>
            </Spacing>
          </>
        ) : null}
      </Row>
      {isView && geoCoordinatesValue && (
        <Row>
          <ItemText><strong>Geo: </strong>{geoCoordinatesValue}</ItemText>
        </Row>
      )}
      {isView && conditionsValue && (
        <Row>
          <ItemText><strong>Access and conditions: </strong>{conditionsValue}</ItemText>
        </Row>
      )}
      {isView && !isAddClimb && (
        <Row>
          <AddClimbButton onClick={() => setIsAddClimb(true)}>
            Add climb
          </AddClimbButton>
        </Row>
      )}
      {isAddClimb && (
        <>
          <Row>
            <AddClimbButton onClick={() => resetClimbForm()}>
              Cancel
            </AddClimbButton>
            <AddClimbButton
              disabled={!newClimbName || !newClimbGrade}
              onClick={handleNewClimbSubmit}
            >
              Save
            </AddClimbButton>
          </Row>
          <ClimbTypeRadioButtons
            defaultValue={'boulder'}
            setNewClimbType={setNewClimbType}
          />
          <ClimbInputRow>
            <Input
              value={newClimbName}
              name="climbName"
              placeholder="Name"
              onChange={({ target }) => setNewClimbName(target.value)}
            />
            <GradeInputLabel sx={ {fontSize: 13} }>Grade</GradeInputLabel>
            <Select
              value={newClimbGrade}
              onChange={({ target }) => setNewClimbGrade(target.value.toString())}
              sx={{ minWidth: '420px' }}
            >
              {gradeOptions.map(i => (<MenuItem key={i} value={i}>{i}</MenuItem>))}
            </Select>
          </ClimbInputRow>
          <ClimbNotesTextArea
            value={newClimbNotes}
            name="climbNotes"
            placeholder="Notes"
            onChange={({ target }) => setNewClimbNotes(target.value)}
          />
        </>
      )}
      {isEdit && (
        <Input
          value={geoCoordinatesValue}
          name="geoCoordinates"
          placeholder="GeoCoordinates e.g. 50.4706,-3.50215"
          onChange={({ target }) => setGeoCoordinatesValue(target.value)}
        />
      )}
      {isEdit && (
        <TextArea
          value={conditionsValue}
          name="conditions"
          placeholder="Access and conditions"
          onChange={({ target }) => setConditionsValue(target.value)}
        />
      )}
      <ConfirmDelete
        handleDelete={handleDelete}
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
      />
    </Wrapper>
  );
}
