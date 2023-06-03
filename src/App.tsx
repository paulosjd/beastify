import React from "react";
import { Redirect, Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./components/Navbar";
import Articles from "./pages/Articles";
import Home from "./pages/Home";
import Logbook from "./pages/Logbook";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const Wrapper = styled.div`
  max-width: 1420px;
  margin: auto;
  padding: 10px 20px;
`;

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Wrapper>
        <Switch>
          <Route exact path="/home" component={Home} />
          <Route exact path="/articles" component={Articles} />
          <Route exact path="/logbook" component={Logbook} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Signup} />
          <Redirect path="*" to="/home" />
        </Switch>
      </Wrapper>
    </BrowserRouter>
  );
}

export default App;
