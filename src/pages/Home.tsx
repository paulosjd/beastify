import React, { ReactElement, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import 'dayjs/locale/de';
import styled from "styled-components";
import { AppContext, filterParamsTypes } from "../AppContext";
import Button from "../components/Button";
import Input from "../components/Input";
import ItemTags from "../components/ItemTags";
import TextArea from "../components/TextArea";
import SavedItem from "../components/SavedItem";
import Search from "../components/Search";
import { Form } from "./Login";
import { Spacing, Wrapper } from "../components/StyledComponents";

const SavedItemWrapper = styled.div`
  width: 100%;
  overflow: auto;
`;

const AddItemButton = styled(Button)`
  min-height: 45px;
`;

const AddItemWrapper = styled.div`
  margin-top: 25px;
  width: 100%
`;

export const filterParamsInitialState = {
  startDate: null,
  endDate: null,
  keyword: null
};

export default function Home (): ReactElement {
  const history = useHistory();
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [editItemId, setEditItemId] = useState<string>("");
  const [viewItemId, setViewItemId] = useState<string>("");
  const [filterParams, setFilterParams] = useState<filterParamsTypes>(filterParamsInitialState);
  const { addSavedItem, getSavedItems, savedItems, currentUser, handleAuthChange } = useContext(AppContext);

  console.log(filterParams)

  useEffect(() => {
    handleAuthChange({
      err: () => {
        history.push("/login");
      },
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getSavedItems();
    // eslint-disable-next-line
  }, [currentUser]);

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
    await addSavedItem({title, summary, url, keywords: tags});
    setTitle("");
    setSummary("");
    setUrl("");
    setTags([]);
    setIsAdd(false);
    await getSavedItems();
  }

  // console.log(dayjs(new Date(2020, 2, 3)))

  return (
    <Wrapper>
      <SavedItemWrapper>
        <Search
          filterParams={filterParams}
          setFilterParams={setFilterParams}
        />
        {savedItems.map((item) => (
          <SavedItem
            key={item.itemId}
            savedItem={item}
            // itemId={item.itemId}
            // title={item.title}
            // summary={item.summary}
            // url={item.url}
            editItemId={editItemId}
            setEditItemId={setEditItemId}
            viewItemId={viewItemId}
            setViewItemId={setViewItemId}
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
            <ItemTags
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
    </Wrapper>
  )
}
