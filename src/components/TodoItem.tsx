import React, { ReactElement } from "react";
import styled from "styled-components";
import Button from "./Button";
import Input from "./Input";
import { AppContext } from "../AppContext";
import { Spacing } from "../pages/Home";

interface Props {
  previousValue: string;
  itemId: string;
}
const Wrapper = styled.div`
  width: 100%;
  margin-top: 20px;
`;

export const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
`;

export default function TodoItem({ previousValue, itemId }: Props): ReactElement {
  const [newVal, setNewVal] = React.useState<string>("");
  const { getTodoItems, updateTodoItem, deleteTodoItem } = React.useContext(AppContext);

  return (
    <Wrapper>
      <Input defaultValue={previousValue} onChange={({ target }) => setNewVal(target.value)} />

      <Row>
        <Spacing fitContent mx="5px" my="5px">
          <Button
            disabled={!newVal}
            onClick={async () => {
              await updateTodoItem({ id: itemId, newValue: newVal });
              await getTodoItems();
            }}
          >
            Update
          </Button>
        </Spacing>
        <Spacing fitContent mx="5px" my="5px">
          <Button
            onClick={async () => {
              await deleteTodoItem(itemId);
              await getTodoItems();
            }}
          >
            Delete
          </Button>
        </Spacing>
      </Row>
    </Wrapper>
  );
}
