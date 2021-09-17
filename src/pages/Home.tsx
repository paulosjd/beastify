import React, { ReactElement } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { AppContext } from "../AppContext";
import Button from "../components/Button";
import Input from "../components/Input";
import TodoItem from "../components/TodoItem";
import { Form } from "./Login";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const Spacing = styled.div<{
  mt?: string;
  mr?: string;
  mb?: string;
  ml?: string;
  mx?: string;
  my?: string;
  fitContent?: boolean;
}>`
  margin-top: ${({ my, mt }) => mt || my};
  margin-bottom: ${({ my, mb }) => mb || my};
  margin-right: ${({ mx, mr }) => mr || mx};
  margin-left: ${({ mx, ml }) => ml || mx};
  width: ${({ fitContent }) => (fitContent ? "fitContent" : "100%")};
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  cursor: pointer;
`;

const TodoItemWrapper = styled.div`
  width: 100%;
  min-height: 300px;
  overflow: auto;
`;

export default function Home(): ReactElement {
  const history = useHistory();
  const [value, setValue] = React.useState<string>("");
  const { addTodoItem, getTodoItems, todoItems, currentUser, handleAuthChange, signOutUser, updateAvatar } =
    React.useContext(AppContext);

  React.useEffect(() => {
    getTodoItems();
    handleAuthChange({
      err: () => {
        history.push("/login");
      },
    });
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    getTodoItems();

    // eslint-disable-next-line
  }, [currentUser]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null && e.target.files.length > 0) {
      const rawImage = e.target.files[0];
      // fetches the extension name of the image
      // gets the last index of the '.' and adds 1 to it
      // returns a substring of all character to the left after this index
      const ext = rawImage.name.substr(rawImage.name.lastIndexOf(".") + 1);
      const image = new Blob([rawImage], { type: "image" });

      updateAvatar({ image, ext });
    }
  };

  return (
    <Wrapper>
      <label>
        <input onChange={handleImageChange} type="file" accept="image/*" hidden />
        <Avatar src={currentUser?.avatar || "https://bit.ly/3hFUl0N"} />
      </label>

      <Spacing>
        <h3>Welcome {currentUser?.displayName}</h3>
      </Spacing>
      <Spacing fitContent mb="20px">
        <Button onClick={signOutUser}>Sign Out</Button>
      </Spacing>

      <TodoItemWrapper>
        {todoItems.length < 1 ? (
          <Spacing mt="70px">
            <h4>No todo item :(</h4>
          </Spacing>
        ) : (
          todoItems.map((item) => <TodoItem itemId={item.itemId} previousValue={item.value} />)
        )}
      </TodoItemWrapper>

      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          await addTodoItem(value);
          setValue("");
          await getTodoItems();
        }}
      >
        <Input
          value={value}
          name="value"
          placeholder="Enter new item..."
          onChange={({ target }) => setValue(target.value)}
        />
        <Spacing mt="10px">
          <Button>Add Item</Button>
        </Spacing>
      </Form>
    </Wrapper>
  );
}
