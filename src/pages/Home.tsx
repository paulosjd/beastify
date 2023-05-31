import React, { ReactElement, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import styled from "styled-components";
import { AppContext, filterParamsTypes } from "../AppContext";
import Button from "../components/Button";
import { Box } from "@mui/material";
import { Spacing, Wrapper } from "../components/StyledComponents";

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

  return (
    <Wrapper>
      <Box component="span" sx={{ p: 4, border: '1px solid #1976d2', borderRadius: 3 }}>
        <Link to="/articles">
          <Button>Articles</Button>
        </Link>
      </Box>
    </Wrapper>
  )
}
