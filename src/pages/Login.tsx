import React, { ReactElement, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AppContext } from "../AppContext";
import Button from "../components/Button";
import Input from "../components/Input";
import {Spacing, Wrapper} from "../components/StyledComponents";

export const Form = styled.form`
  min-width: 100%;
  text-align: center;
`;

type LocationState = {
  logout : boolean;
}

export default function Login(): ReactElement {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { logInUser, signOutUser, signInWithGoogle, handleAuthChange, loading } = React.useContext(AppContext);

  useEffect(() => {
    if (location.state?.logout) {
      signOutUser();
    }
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

        <Spacing mb="20px">
          <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
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
