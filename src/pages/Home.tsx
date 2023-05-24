import React, {ReactElement, useContext, useEffect, useState} from "react";
import {useHistory} from "react-router";
import { DatePicker } from '@mui/x-date-pickers-pro';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import { enUS } from '@mui/x-date-pickers/locales';
import styled from "styled-components";
import {AppContext} from "../AppContext";
import Button from "../components/Button";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import SavedItem from "../components/SavedItem";
import Search from "../components/Search";
import {Form} from "./Login";
import {Spacing, Wrapper} from "../components/StyledComponents";

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

export interface filterParamsTypes {
  startDate:  Dayjs | null;
  endDate:  Dayjs | null;
  keyword:  string | null;
}

export default function Home(): ReactElement {
  const history = useHistory();
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [editItemId, setEditItemId] = useState<string>("");
  const [viewItemId, setViewItemId] = useState<string>("");
  const [filterParams, setFilterParams] = useState<filterParamsTypes>({
    startDate: null,
    endDate: null,
    keyword: null
  });
  const { addSavedItem, getSavedItems, savedItems, currentUser, handleAuthChange } = useContext(AppContext);

  console.log(filterParams)

  useEffect(() => {
    handleAuthChange({
      err: () => {
        history.push("/login");
      },
    });
  }, []);

  useEffect(() => {
    getSavedItems();
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

  // console.log(dayjs(new Date(2020, 2, 3)))
  console.log(filterParams)
  return (
    <Wrapper>
      {!!savedItems.length && (
        <SavedItemWrapper>
          <Search
            filterParams={filterParams}
            setFilterParams={setFilterParams}
          />
          {savedItems.map((item) => (
              <SavedItem
                key={item.itemId}
                itemId={item.itemId}
                title={item.title}
                summary={item.summary}
                url={item.url}
                editItemId={editItemId}
                setEditItemId={setEditItemId}
                viewItemId={viewItemId}
                setViewItemId={setViewItemId}
              />
            )
          )}
        </SavedItemWrapper>
      )}
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
          <Form
            onSubmit={async (e) => {
              e.preventDefault();
              await addSavedItem({title, summary, url});
              setTitle("");
              setSummary("");
              setUrl("");
              setIsAdd(false);
              await getSavedItems();
            }}
          >
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
            <Spacing mt="10px">
              <AddItemButton disabled={!title}>
                Save
              </AddItemButton>
            </Spacing>
          </Form>
        )}
      </AddItemWrapper>
    </Wrapper>
  );
}
