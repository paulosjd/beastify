import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import NotesIcon from '@mui/icons-material/Notes';
import { Dayjs } from "dayjs";
import dayjs from 'dayjs';
import styled from "styled-components";
import Button from "./Button";
import Input from "./Input";
import { AppContext } from "../AppContext";
import { sortByName } from "../lib/helpers";
import { SavedTodoCragType } from "../lib/types";
import { Spacing, FormButton, Row, FlexStartRow } from "./StyledComponents";
import TextArea from "./TextArea";
import TempPicker from "./TempPicker";
import ClimbForm from "./ClimbForm";
import ConfirmDelete from "./ConfirmDelete";
import styles from "./styles.module.css";
import SavedCragInfo from "./SavedCragInfo";

const Wrapper = styled.div`
  width: 100%;
  margin-top: 1px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  text-align: left;
`;

const ItemText = styled.p`
  margin: 0
`;

const ClimbItemRow = styled(FlexStartRow)`
  margin-top: 5px;
`;

const CragInput = styled(Input)`
  min-height: 45px;
  height: 56px;
  width: 17%;
  margin-left: 12px;
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
    savedItem: { id: itemId, approachTime, driveTime, minTemp, maxTemp, name, geoCoordinates, conditions },
    addClimbCragId, setAddClimbCragId, editItemId, setEditItemId, viewItemId, setViewItemId, cancelAddCrag
  } = props;
  const [approachTimeValue, setApproachTimeValue] = useState<string>(approachTime);
  const [driveTimeValue, setDriveTimeValue] = useState<string>(driveTime);
  const [minTempValue, setMinTempValue] = useState<number>(parseInt(minTemp) || 0);
  const [maxTempValue, setMaxTempValue] = useState<number>(parseInt(maxTemp) || 25);
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

  useEffect(() => {
    const handleEsc = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape' && (isEdit || isView)) {
        viewToggle();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
    // eslint-disable-next-line
  }, []);

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
      newApproachTime: approachTimeValue,
      newDriveTime: driveTimeValue,
      newMinTemp: minTempValue.toString(),
      newMaxTemp: maxTempValue.toString(),
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

  const timePickSlotProps = {
    textField: {
      error: false,
    }
  };

  // TODO reduce space below title when not view/edit

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
      {isView && (driveTime || approachTime || (maxTemp || minTemp)) && (
        <SavedCragInfo
          driveTime={driveTime}
          approachTime={approachTime}
          maxTemp={maxTemp}
          minTemp={minTemp}
        />
      )}
      {isView && conditions && (
        <Row className={`${styles.mb15} ${styles.mt5}`}>
          <ItemText><strong>Notes: </strong>{conditions}</ItemText>
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
          <div className={styles.mb10} style={{display: 'flex'}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className={styles.w18pc}>
                <TimePicker
                  views={['minutes', ]}
                  format="mm"
                  label={'Drive time'}
                  value={driveTimeValue ? dayjs().minute(parseInt(driveTimeValue)) : ''}
                  onChange={( val) => setDriveTimeValue(dayjs(val).minute().toString())}
                  sx={{mr: 2}}
                  slotProps={timePickSlotProps}
                />
              </div>
              <div className={styles.w18pc}>
                <TimePicker
                  views={['minutes', ]}
                  format="mm"
                  label={'Approach time'}
                  value={approachTimeValue ? dayjs().minute(parseInt(approachTimeValue)) : ''}
                  onChange={( val) => setApproachTimeValue(dayjs(val).minute().toString())}
                  sx={{mr: 2}}
                  slotProps={timePickSlotProps}
                />
              </div>
            </LocalizationProvider>
            <CragInput
              value={geoCoordinatesValue}
              name="geoCoordinates"
              placeholder="GeoCoords. e.g. 50.4706,-3.50215"
              onChange={({ target }) => setGeoCoordinatesValue(target.value)}
            />
            <TempPicker
              minTempValue={minTempValue}
              maxTempValue={maxTempValue}
              setMinTempValue={setMinTempValue}
              setMaxTempValue={setMaxTempValue}
            />
          </div>
          <TextArea
            value={conditionsValue}
            name="conditions"
            placeholder="Access and conditions"
            onChange={({ target }) => setConditionsValue(target.value)}
            style={{maxHeight: '45px', marginBottom: '10px'}}
          />
          <Spacing mb={'10px'}>
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
          </Spacing>
        </>
      )}
      <div>
        {todoClimbs.sort(sortByName).map(climbItem => (
          <ClimbItemRow>
            <p className={styles.climbText}>{climbItem.name}</p>
            <p className={styles.climbText}>{climbItem.grade}</p>
            {climbItem.notes && (<p className={`${styles.climbText} ${styles.secondaryColor}`}>{climbItem.notes}</p>)}
            {(isView || isEdit)  && (
              <IconButton
                color="primary"
                onClick={() => setConfirmDeleteClimbId(climbItem.id)}
                sx={{ py: 0 }}
              >
                <ClearIcon />
              </IconButton>
            )}
          </ClimbItemRow>
        ))}
      </div>
      {isView && !isAddClimb && (
        <Row>
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