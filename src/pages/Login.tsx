import React, { ReactElement } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AppContext } from "../AppContext";
import Button from "../components/Button";
import Input from "../components/Input";
import { Spacing, Wrapper } from "./Home";

export const Form = styled.form`
  min-width: 100%;
  text-align: center;
`;

export default function Login(): ReactElement {
  const history = useHistory();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const { logInUser, handleAuthChange, loading } = React.useContext(AppContext);

  React.useEffect(() => {
    handleAuthChange({
      cb: () => {
        history.push("/");
      },
    });
    // eslint-disable-next-line
  }, []);

  return (
    <Wrapper>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          logInUser(email, password);
        }}
      >
        <Spacing mb="20px">
          <Input
            name="email"
            type="email"
            required
            placeholder="Enter your email..."
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
        </Spacing>

        <Spacing mb="20px">
          <Input
            name="password"
            type="password"
            required
            placeholder="Enter your password..."
            value={password}
            minLength={6}
            onChange={({ target }) => setPassword(target.value)}
          />
        </Spacing>

        <Spacing mt="20px" mb="10px">
          <Button>{loading ? "Loading..." : "Login"}</Button>
        </Spacing>

        <small>
          Do not have an account ? <Link to="/register">Register</Link>
        </small>
      </Form>
    </Wrapper>
  );
}
