import React, { ReactElement, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import styled from "styled-components";
import { AppContext } from "../AppContext";
import Button from "../components/Button";
import { Box } from "@mui/material";
import { Wrapper } from "../components/StyledComponents";

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

  // TODO projects ??

  // TODO make below DRY using .map

  return (
    <HomeWrapper>
      <Box component="span" sx={{ p: 4, border: '1px solid #1976d2', borderRadius: 3 }}>
        <Link to="/articles">
          <Button>Articles</Button>
        </Link>
      </Box>
      <Box component="span" sx={{ p: 4, border: '1px solid #1976d2', borderRadius: 3, mt: 3 }}>
        <Link to="/logbook">
          <Button>Logbook</Button>
        </Link>
      </Box>
      <Box component="span" sx={{ p: 4, border: '1px solid #1976d2', borderRadius: 3, mt: 3 }}>
        <Link to="/tracker">
          <Button>Tracker</Button>
        </Link>
      </Box>
    </HomeWrapper>
  )
}
