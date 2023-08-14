import React, { useState } from "react";
import { IconButton } from "@mui/material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import styled from "styled-components";
import Button from "./Button";
import Input from "./Input";
import { AppContext } from "../AppContext";
import { sortByName } from "../lib/helpers";
import { SavedTodoCragType } from "../lib/types";
import { Spacing, FormButton, FlexStartRow } from "./StyledComponents";
import TextArea from "./TextArea";
import ClimbForm from "./ClimbForm";
import ConfirmDelete from "./ConfirmDelete";
import styles from "./styles.module.css";

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

const ItemText = styled.p`
  margin: 0
`;

type SavedCragProps = {
  savedItem: SavedTodoCragType;
  editItemId: string;
  viewItemId: string;
  addClimbCragId: string;
  setAddClimbCragId: (val: string) => void;
  setViewItemId: (itemId: string) => void;
  setEditItemId: (itemId: string) => void;
  cancelAddCrag: () => void;
};

const SavedCrag = (props: SavedCragProps) => {
  const {
    savedItem: { id: itemId, name, geoCoordinates, conditions },
    addClimbCragId, setAddClimbCragId, editItemId, setEditItemId, viewItemId, setViewItemId, cancelAddCrag
  } = props;
  const [conditionsValue, setConditionsValue] = useState<string>(conditions);
  const [geoCoordinatesValue, setGeoCoordinatesValue] = useState<string>(geoCoordinates);
  const [confirmDeleteClimbId, setConfirmDeleteClimbId] = useState<string>('');
  const [openConfirmDeleteCrag, setOpenConfirmDeleteCrag] = useState<boolean>(false);
  const [newClimbName, setNewClimbName] = useState<string>('');
  const [newClimbGrade, setNewClimbGrade] = useState<string>('');
  const [newClimbNotes, setNewClimbNotes] = useState<string>('');
  const [newClimbType, setNewClimbType] = useState<string>('boulder');
  const {
    updateSavedTodoCrag, deleteSavedItem, getSavedTodoCrags, addTodoClimb, getSavedTodoClimbs, savedTodoClimbs
  } = React.useContext(AppContext);

  const isView = viewItemId === itemId;
  const isEdit = editItemId === itemId;
  const isAddClimb = addClimbCragId === itemId;
  const newClimbData = { newClimbName, newClimbType, newClimbNotes, newClimbGrade };
  const todoClimbs = savedTodoClimbs.filter(i => i.cragId === itemId)

  const viewToggle = () => {
    resetClimbForm();
    cancelAddCrag();
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
    setAddClimbCragId('');
    setNewClimbGrade('');
    setNewClimbName('');
    setNewClimbNotes('');
  };

  const handleEdit = () => {
    resetClimbForm();
    cancelAddCrag();
    setEditItemId(itemId);
    setViewItemId('');
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

  const handleDeleteCrag = async () => {
    await deleteSavedItem(itemId, 'todoCrag');
    setEditItemId('');
    await getSavedTodoCrags();
  };

  const handleDeleteClimb = async () => {
    await deleteSavedItem(confirmDeleteClimbId, 'todoClimb');
    setConfirmDeleteClimbId('');
    await getSavedTodoClimbs();
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
    setAddClimbCragId('');
    await getSavedTodoClimbs();
  }

  const handleAddClimbInput = (val: string, inputType: string) => {
    switch (inputType) {
      case 'type':
        setNewClimbType(val);
        break;
      case 'name':
        setNewClimbName(val);
        break;
      case 'grade':
        setNewClimbGrade(val);
        break;
      case 'notes':
        setNewClimbNotes(val);
        break;
      default:
        break;
    }
  }

  // TODO map

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
        {isView && (
          <>
            <Spacing fitContent my="5px" float="right">
              <Button onClick={handleEdit}>
                Edit
              </Button>
            </Spacing>
          </>
        )}
      </Row>
      {isView && geoCoordinatesValue && (
        <Row className={styles.mb10}>
          <ItemText><strong>Geo: </strong>{geoCoordinatesValue}</ItemText>
        </Row>
      )}
      {isView && conditionsValue && (
        <Row className={styles.mb10}>
          <ItemText><strong>Access and conditions: </strong>{conditionsValue}</ItemText>
        </Row>
      )}
      {isAddClimb && (
        <ClimbForm
          newClimbData={newClimbData}
          setNewClimbData={handleAddClimbInput}
          resetClimbForm={resetClimbForm}
          handleNewClimbSubmit={handleNewClimbSubmit}
        />
      )}
      {isEdit && (
        <>
          <Input
            value={geoCoordinatesValue}
            name="geoCoordinates"
            placeholder="GeoCoordinates e.g. 50.4706,-3.50215"
            onChange={({ target }) => setGeoCoordinatesValue(target.value)}
          />
          <TextArea
            value={conditionsValue}
            name="conditions"
            placeholder="Access and conditions"
            onChange={({ target }) => setConditionsValue(target.value)}
          />
          <FlexStartRow>
            <FormButton onClick={cancelEdit}>
              Cancel
            </FormButton>
            <FormButton onClick={() => setOpenConfirmDeleteCrag(true)}>
              Delete
            </FormButton>
            <FormButton onClick={handleSave}>
              Save
            </FormButton>
          </FlexStartRow>
        </>
      )}
      <div className={todoClimbs.length && (isView || isEdit) ? styles.mt15 : undefined}>
      {todoClimbs.sort(sortByName).map(climbItem => (
        <FlexStartRow>
          <p className={styles.climbText}>{climbItem.name}</p>
          <p className={styles.climbText}>{climbItem.grade}</p>
          {climbItem.notes && (<p className={`${styles.climbText} ${styles.secondaryColor}`}>{climbItem.notes}</p>)}
          <IconButton
            color="primary"
            onClick={() => setConfirmDeleteClimbId(climbItem.id)}
            sx={{ paddingTop: 0 }}
          >
            <ClearIcon />
          </IconButton>
        </FlexStartRow>
      ))}
      </div>
      {isView && !isAddClimb && (
        <Row >
          <FormButton onClick={() => setAddClimbCragId(itemId)}>
            Add climb
          </FormButton>
        </Row>
      )}
      <ConfirmDelete
        handleDelete={handleDeleteCrag}
        open={openConfirmDeleteCrag}
        onClose={() => setOpenConfirmDeleteCrag(false)}
      />
      <ConfirmDelete
        handleDelete={handleDeleteClimb}
        open={!!confirmDeleteClimbId}
        onClose={() => setConfirmDeleteClimbId('')}
      />
    </Wrapper>
  );
}

export default SavedCrag;