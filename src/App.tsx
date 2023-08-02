import React from "react";
import { Redirect, Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./components/Navbar";
import Articles from "./pages/Articles";
import Climbs from "./pages/Climbs";
import Home from "./pages/Home";
import Logbook from "./pages/Logbook";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Tracker from "./pages/Tracker";
import PrivateRoute from "./components/PrivateRoute"

const AppWrapper = styled.div`
  max-width: 1420px;
  margin: auto;
  padding: 10px 20px;
`;

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <AppWrapper>
        <Switch>
          <Route exact path="/home" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Signup} />
          <PrivateRoute path="/articles" component={Articles} />
          <PrivateRoute path="/logbook" component={Logbook} />
          <PrivateRoute path="/tracker" component={Tracker} />
          <PrivateRoute path="/climbs" component={Climbs} />
          <Redirect path="*" to="/home" />
        </Switch>
      </AppWrapper>
    </BrowserRouter>
  );
}

export default App;
