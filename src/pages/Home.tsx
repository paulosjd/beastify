import React, { ReactElement, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import styled from "styled-components";
import { AppContext } from "../AppContext";
import Button from "../components/Button";
import { Box } from "@mui/material";
import { Wrapper } from "../components/StyledComponents";
import Articles from "./Articles";

const HomeWrapper = styled(Wrapper)`
  margin-top: 30px;
`;

export default function Home(): ReactElement {
  const history = useHistory();
  const { handleAuthChange } = useContext(AppContext);

  useEffect(() => {
    handleAuthChange({
      err: () => {
        history.push("/login");
      },
    });
    // eslint-disable-next-line
  }, []);

  const itemsList = ['Articles', 'Logbook', 'Tracker', 'Climbs To Do']

  return (
    <HomeWrapper>
      {itemsList.map((label, ind) => (
        <Box
          component="span"
          key={label}
          sx={{ p: 4, border: '1px solid #1976d2', borderRadius: 3, mt: ind !== 0 ? 3 : undefined }}
        >
          <Link to={`/${label.split(' ')[0].toLowerCase()}`}>
            <Button>{label}</Button>
          </Link>
        </Box>
      ))}
    </HomeWrapper>
  )
}
