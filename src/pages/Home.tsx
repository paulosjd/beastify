import React, { ReactElement, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import useGoogleSheets from 'use-google-sheets';
import styled from "styled-components";
import { AppContext, filterParamsTypes } from "../AppContext";
import Button from "../components/Button";
import { Box } from "@mui/material";
import { Spacing, Wrapper } from "../components/StyledComponents";

interface sheetsParams {
  apiKey: string;
  sheetId: string;
  sheetOptions?: { id: string }[]
}


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

  //   const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });
  //
  //   const sheets = google.sheets({ version: 'v4', auth });
  //
  //   const range = `Sheet1!A${id}:C${id}`;
  //
  //   const response = await sheets.spreadsheets.values.get({
  //     spreadsheetId: ,
  //     range,
  //   });
  //
  //   // Result
  //   if (response && response.data && response.data.values) {
  //     const [title, content] = response.data.values[0];
  //     console.log(title, content)
  //


  return (
    <Wrapper>
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
    </Wrapper>
  )
}
