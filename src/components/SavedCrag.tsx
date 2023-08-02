import React, { ReactElement, useState } from "react";
import { Link, IconButton } from "@mui/material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import styled from "styled-components";
import Button from "./Button";
import Input from "./Input";
import { AppContext } from "../AppContext";
import { SavedTodoCragType } from "../lib/types";
import { Spacing } from "./StyledComponents";
import TextArea from "./TextArea";
import styles from "./styles.module.css";
import ConfirmDelete from "./ConfirmDelete";

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

const AddClimbButton = styled(Button)`
  width: 200px;
  margin: 12px 0 10px 0;
  background-color: #1976d2;
`

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
  const { updateSavedTodoCrag, deleteSavedItem, getSavedTodoCrags, addTodoClimb } = React.useContext(AppContext);
  const isView = viewItemId === itemId;
  const isEdit = editItemId === itemId;

  const viewToggle = () => {
    if (isView || isEdit) {
      setViewItemId('');
      setEditItemId('');
    } else {
      setViewItemId(itemId);
    }
  };

  const handleSave = () => {
    updateSavedTodoCrag({
      id: itemId,
      name,
      newGeocoordinates: geoCoordinatesValue,
      newConditions: conditionsValue
    });
    setEditItemId('');
    setViewItemId(itemId);
  };

  const handleDelete = async () => {
    await deleteSavedItem(itemId, 'todoCrag');
    await getSavedTodoCrags();
  };

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
      {isView && (
        <Row>
          <AddClimbButton onClick={() => {}}>
            Add climb
          </AddClimbButton>
        </Row>
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
