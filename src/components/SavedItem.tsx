import React, { ReactElement, useState } from "react";
import { Link, IconButton } from "@mui/material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import styled from "styled-components";
import Button from "./Button";
import Input from "./Input";
import { AppContext, savedItemInterface } from "../AppContext";
import { Spacing } from "./StyledComponents";
import TextArea from "./TextArea";
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

const RowMargin = styled(Row)`
    margin-bottom: 20px;
`;

// interface savedItemProps extends savedItemInterface {
//   editItemId: string;
//   viewItemId: string;
//   setViewItemId: (itemId: string) => void;
//   setEditItemId: (itemId: string) => void;
// }

interface savedItemProps {
  savedItem: savedItemInterface;
  editItemId: string;
  viewItemId: string;
  setViewItemId: (itemId: string) => void;
  setEditItemId: (itemId: string) => void;
}

export default function SavedItem(
  { savedItem: {itemId, title, summary, url, keywords}, editItemId, setEditItemId, viewItemId, setViewItemId }: savedItemProps
  // { itemId, title, summary, url, editItemId, setEditItemId, viewItemId, setViewItemId }: savedItemProps
): ReactElement {

  const [itemTitle, setItemTitle] = useState<string>(title);
  const [itemSummary, setItemSummary] = useState<string>(summary);
  const [itemUrl, setItemUrl] = useState<string>(url);
  const { getSavedItems, updateSavedItem, deleteSavedItem } = React.useContext(AppContext);
  const isView = viewItemId == itemId;

  if (itemId === editItemId) {
    return (
      <Wrapper>
        <Input
          value={itemTitle}
          name="title"
          placeholder="Title"
          onChange={({ target }) => setItemTitle(target.value)}
        />
        <TextArea
          value={itemSummary}
          name="summary"
          placeholder="Summary"
          onChange={({ target }) => setItemSummary(target.value)}
        />
        <Input
          value={itemUrl}
          name="url"
          placeholder="URL"
          onChange={({ target }) => setItemUrl(target.value)}
        />
        <Row>
          <Spacing fitContent mx="5px" my="5px">
            <Button
              disabled={!itemTitle}
              onClick={() => {
                updateSavedItem({
                  id: itemId,
                  newTitle: itemTitle,
                  newSummary: itemSummary,
                  newUrl: itemUrl,
                  newKeywords: keywords
                });
                setEditItemId('');
              }}
            >
              Save
            </Button>
          </Spacing>
          <Spacing fitContent mx="5px" my="5px">
            <Button
              onClick={async () => {
                await deleteSavedItem(itemId);
                await getSavedItems();
              }}
            >
              Delete
            </Button>
          </Spacing>
        </Row>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Row>
        <h4 className={styles.titleRowElem}>{itemTitle}</h4>
        {(!itemSummary && !itemUrl) ? null : !isView ? (
          <IconButton
            color="primary"
            component="label"
            onClick={() => {
              setViewItemId(itemId);
              setEditItemId('');
            }}
          >
            <ExpandCircleDownIcon />
          </IconButton>
        ) : (
          <IconButton
            color="primary"
            component="label"
            onClick={() => {
              setViewItemId('');
            }}
          >
            <ArrowDropUpIcon />
          </IconButton>
        )
      }
      </Row>
      {isView && itemSummary && (
        <Row>
          <p>{itemSummary}</p>
        </Row>
      )}
      {isView && itemUrl && (
        <RowMargin>
          <Link href={itemUrl} underline="hover" target="_blank" rel="noreferrer">
            Source
          </Link>
        </RowMargin>
      )}
      <Row>
        <Spacing fitContent mx="5px" my="5px">
          <Button
            onClick={() => {
              setEditItemId(itemId);
              setViewItemId('');
            }}
          >
            Edit
          </Button>
        </Spacing>
        <Spacing fitContent mx="5px" my="5px">
          <Button
            onClick={async () => {
              await deleteSavedItem(itemId);
              await getSavedItems();
            }}
          >
            Delete
          </Button>
        </Spacing>
      </Row>
    </Wrapper>
  );
}
