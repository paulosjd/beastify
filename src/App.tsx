import React, {useContext, useEffect, useState} from "react";
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
import SettingsDialog from "./components/SettingsDialog"
import { AppContext } from "./AppContext";

const AppWrapper = styled.div`
  margin: auto;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
`;

function App() {
  const [settingsDialogType, setSettingsDialogType] = useState<string>('');
  const {
    userConfig, currentUser, getUserConfig, addSheetIdConfig, updateSheetIdConfig
  } = useContext(AppContext);

  useEffect(() => {
    getUserConfig();
    // eslint-disable-next-line
  }, [currentUser]);

  return (
    <BrowserRouter>
      <Navbar
        setSettingsDialogType={setSettingsDialogType}
      />
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
        <SettingsDialog
          settingsDialogType={settingsDialogType}
          onClose={() => setSettingsDialogType('')}
        />
      </AppWrapper>
    </BrowserRouter>
  );
}

export default App;
