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
import ArticleTags from "./ArticleTags";

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

const RowMargin = styled(Row)`
    margin-bottom: 8px;
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
  const { getSavedArticles, updateSavedArticle, deleteSavedArticle } = React.useContext(AppContext);
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

  return (
    <Wrapper>
      <Row>
        <h4 className={styles.cragNameElem} onClick={viewToggle}>
          {name}
        </h4>
        {isView && (
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
            <Spacing fitContent my="5px" float="right">
              <Button
                onClick={async () => {
                  await deleteSavedArticle(itemId);
                  await getSavedArticles();
                }}
              >
                Delete
              </Button>
            </Spacing>
          </>
        )}
        <Spacing fitContent my="5px" float="right">
          <IconButton
            color="primary"
            component="label"
            onClick={viewToggle}
          >
            {isView || isEdit ? <ArrowDropUpIcon /> : <ExpandCircleDownIcon />}
          </IconButton>
        </Spacing>
      </Row>
      {isView && conditions && (
        <Row>
          <p><strong>Access and conditions: </strong>{conditions}</p>
        </Row>
      )}
      {isEdit && (
        <TextArea
          value={conditionsValue}
          name="conditions"
          placeholder="Access and conditions"
          onChange={({ target }) => setConditionsValue(target.value)}
        />
      )}
      <Row>

      </Row>
    </Wrapper>
  );
}
