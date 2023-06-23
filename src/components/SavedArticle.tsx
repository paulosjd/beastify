import React, { ReactElement, useState } from "react";
import { Link, IconButton } from "@mui/material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import styled from "styled-components";
import Button from "./Button";
import Input from "./Input";
import { AppContext } from "../AppContext";
import { SavedArticleType } from "../lib/types";
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

interface savedItemProps {
  savedItem: SavedArticleType;
  editItemId: string;
  viewItemId: string;
  tags: string[];
  setViewItemId: (itemId: string) => void;
  setEditItemId: (itemId: string) => void;
  setTags: (newTags: string[]) => void;
}

export default function SavedArticle(props: savedItemProps): ReactElement {
  const {
    savedItem: { itemId, title, summary, url, keywords }, tags, editItemId, setEditItemId, viewItemId, setViewItemId, setTags
  } = props;
  const [itemTitle, setItemTitle] = useState<string>(title);
  const [itemSummary, setItemSummary] = useState<string>(summary);
  const [itemUrl, setItemUrl] = useState<string>(url);
  const [itemKeywords, setItemKeywords] = useState<string[]>(keywords);
  const { getSavedArticles, updateSavedArticle, deleteSavedArticle } = React.useContext(AppContext);
  const isView = viewItemId === itemId;
  const itemTags = Array.from(new Set(itemKeywords.concat(tags)));

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
        <ArticleTags
          isEdit
          tags={itemTags}
          setTags={setTags}
          itemKeywords={itemKeywords}
          setItemKeywords={setItemKeywords}
        />
        <Row>
          <Spacing fitContent mx="5px" my="5px">
            <Button
              disabled={!itemTitle}
              onClick={() => {
                updateSavedArticle({
                  id: itemId,
                  newTitle: itemTitle,
                  newSummary: itemSummary,
                  newUrl: itemUrl,
                  newKeywords: itemTags
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
                await deleteSavedArticle(itemId);
                await getSavedArticles();
              }}
            >
              Delete
            </Button>
          </Spacing>
        </Row>
      </Wrapper>
    );
  }

  const viewToggle = () => {
    if (isView) {
      setViewItemId('');
    } else {
      setViewItemId(itemId);
      setEditItemId('');
    }
  };

  return (
    <Wrapper>
      <Row>
        <h4 className={styles.titleRowElem} onClick={viewToggle}>
          {itemTitle}
        </h4>
        <Spacing fitContent my="5px" float="right">
        {(!itemSummary && !itemUrl && itemKeywords.length === 0) ? (
          <IconButton
            disableRipple
            sx={{ color:'#FFF' }}
          >
            <ExpandCircleDownIcon />
          </IconButton>
        ) : !isView ? (
          <IconButton
            color="primary"
            component="label"
            onClick={viewToggle}
          >
            <ExpandCircleDownIcon />
          </IconButton>
        ) : (
          <IconButton
            color="primary"
            component="label"
            onClick={viewToggle}
          >
            <ArrowDropUpIcon />
          </IconButton>
        )}
        </Spacing>
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
      {isView && !!keywords.length && (
        <ArticleTags
          tags={itemTags}
          setTags={setTags}
        />
      )}
      <Row>

      </Row>
    </Wrapper>
  );
}
