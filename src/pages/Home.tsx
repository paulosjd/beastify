import React, {ReactElement, useContext, useEffect, useState} from "react";
import {useHistory} from "react-router";
import styled from "styled-components";
import {AppContext} from "../AppContext";
import Button from "../components/Button";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import SavedItem from "../components/SavedItem";
import {Form} from "./Login";
import {Spacing, Wrapper} from "../components/StyledComponents";

const SavedItemWrapper = styled.div`
  width: 100%;
  overflow: auto;
`;

export default function Home(): ReactElement {
  const history = useHistory();
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [editItemId, setEditItemId] = useState<string>("");
  const [viewItemId, setViewItemId] = useState<string>("");
  const { addSavedItem, getSavedItems, savedItems, currentUser, handleAuthChange } = useContext(AppContext);

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

  return (
    <Wrapper>
      <SavedItemWrapper>
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
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          await addSavedItem({title, summary, url});
          setTitle("");
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
          placeholder="URL"
          onChange={({ target }) => setUrl(target.value)}
        />
        <Spacing mt="10px">
          <Button disabled={!title}>
            Add Item
          </Button>
        </Spacing>
      </Form>
    </Wrapper>
  );
}
