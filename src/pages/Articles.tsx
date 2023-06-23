import React, { ReactElement, useContext, useEffect, useState } from "react";
import 'dayjs/locale/de';
import styled from "styled-components";
import { AppContext } from "../AppContext";
import { FilterParamsType } from "../lib/types";
import Button from "../components/Button";
import Input from "../components/Input";
import ArticleTags from "../components/ArticleTags";
import TextArea from "../components/TextArea";
import SavedArticle from "../components/SavedArticle";
import Search from "../components/Search";
import { Spacing, Wrapper } from "../components/StyledComponents";

const ArticlesWrapper = styled(Wrapper)`
  max-width: 1320px;
`;

const SavedItemWrapper = styled.div`
  width: 100%;
  overflow: auto;
`;

const AddItemButton = styled(Button)`
  min-height: 45px;
`;

const AddItemWrapper = styled.div`
  margin-top: 25px;
  margin-bottom: 10px;
  width: 100%
`;

export const filterParamsInitialState = {
  startDate: null,
  endDate: null,
  keyword: null
};

export default function Articles(): ReactElement {
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [editItemId, setEditItemId] = useState<string>("");
  const [viewItemId, setViewItemId] = useState<string>("");
  const [filterParams, setFilterParams] = useState<FilterParamsType>(filterParamsInitialState);
  const { addArticle, getSavedArticles, savedArticles, currentUser } = useContext(AppContext);

  useEffect(() => {
    getSavedArticles();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleEsc = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        setIsAdd(false);
        setEditItemId('');
        setViewItemId('');
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleSubmit = async () => {
    await addArticle({title, summary, url, keywords: tags});
    setTitle("");
    setSummary("");
    setUrl("");
    setTags([]);
    setIsAdd(false);
    await getSavedArticles();
  }

  return (
    <ArticlesWrapper>
      <SavedItemWrapper>
        <Search
          filterParams={filterParams}
          setFilterParams={setFilterParams}
        />
        {savedArticles.map((item) => (
          <SavedArticle
            key={item.itemId}
            savedItem={item}
            tags={tags}
            editItemId={editItemId}
            setEditItemId={setEditItemId}
            viewItemId={viewItemId}
            setViewItemId={setViewItemId}
            setTags={setTags}
          />
        ))}
      </SavedItemWrapper>
      <AddItemWrapper>
        <Spacing mt="10px">
          <AddItemButton
            style={{ display: isAdd ? 'none' : undefined }}
            onClick={() => setIsAdd(true)}
          >
            Add Item
          </AddItemButton>
        </Spacing>
        {isAdd && (
          <div>
            <Input
              value={title}
              name="title"
              placeholder="Title"
              onChange={({ target }) => setTitle(target.value)}
            />
            <TextArea
              value={summary}
              name="summary"
              placeholder="Summary"
              onChange={({ target }) => setSummary(target.value)}
            />
            <Input
              value={url}
              name="url"
              placeholder="Source URL"
              onChange={({ target }) => setUrl(target.value)}
            />
            <ArticleTags
              isEdit={isAdd}
              tags={tags}
              setTags={setTags}
            />
            <Spacing mt="10px">
              <AddItemButton
                disabled={!title}
                onClick={handleSubmit}
              >
                Save
              </AddItemButton>
            </Spacing>
          </div>
        )}
      </AddItemWrapper>
    </ArticlesWrapper>
  )
}
