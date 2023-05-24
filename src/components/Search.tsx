import React, {ReactElement, useContext, useState} from "react";
import { DatePicker } from '@mui/x-date-pickers-pro';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import { enUS } from '@mui/x-date-pickers/locales';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import styled from "styled-components";
import Input from "./Input";
import {AppContext} from "../AppContext";
import { filterParamsTypes } from "../pages/Home";
import styles from "./styles.module.css";
import {IconButton} from "@mui/material";
import Clear from "@mui/icons-material/Clear";
import Button from "./Button";

const SearchWrapper = styled.div`
  border: 1px solid #A5ABAF;
  margin-bottom: 15px;
`;

const SearchButton = styled(Button)`
  min-height: 45px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FirstRow = styled(Row)`
  padding: 15px;
`;

interface searchProps {
  filterParams: filterParamsTypes;
  setFilterParams: (params: filterParamsTypes) => void;
}

export default function Search({ filterParams }: searchProps): ReactElement {

  const { startDate, endDate, keyword } = filterParams;
  const [itemTitle, setItemTitle] = useState<string>('');
  const { getSavedItems } = useContext(AppContext);

  return (
    <SearchWrapper>
      <FirstRow>
        <Input
          value={itemTitle}
          name="title"
          placeholder="Title"
          onChange={({ target }) => setItemTitle(target.value)}
          className={styles.keywordInput}
        />
        <SearchButton
          style={{ display: false ? 'none' : undefined }}
          onClick={() => {
            // getSavedItems
          }}
        >
          Add Item
        </SearchButton>
      </FirstRow>
      <Row>
        <LocalizationProvider
          localeText={enUS.components.MuiLocalizationProvider.defaultProps.localeText}
          dateAdapter={AdapterDayjs}
          adapterLocale="en-gb"
        >
          <DemoContainer components={['DatePicker', 'DatePicker']} sx={{mr: 2, mb: 2, ml: 2}}>
            <DatePicker
              value={dayjs(new Date(2020, 2, 3))}
              onChange={newValue => {console.log(newValue)}}
              format="DD/MM/YYYY"
              label="Start Date"
            />
            <DatePicker
              value={dayjs(new Date(2020, 2, 3))}
              onChange={newValue => {console.log(newValue)}}
              format="DD/MM/YYYY"
              label="End Date"
            />
          </DemoContainer>
        </LocalizationProvider>
        <IconButton
          sx={{mr: 5, mt: 2, mb: 2}}
          component="label"
          style={{borderRadius: 0.5}}
          onClick={() => {

          }}
        >
          <Clear />
        </IconButton>
      </Row>
    </SearchWrapper>
  );
}
