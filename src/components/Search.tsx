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
  border-radius: 3px;
  margin-bottom: 15px;
`;

const SearchButton = styled(Button)`
  width: 40%;
  height: 42px;
  background-color: #4761B8;
  margin-left: 42px;
  margin-top: 5px;
`;

const Row = styled.div`
  display: flex;
`;

const SearchRow = styled(Row)`
  padding: 15px;
`;

const DateRow = styled(Row)`
  justify-content: space-between;
`;


const SearchInput = styled(Input)`
  width: 281px;
`;

interface searchProps {
  filterParams: filterParamsTypes;
  setFilterParams: (params: filterParamsTypes) => void;
}

export default function Search({ filterParams, setFilterParams }: searchProps): ReactElement {

  const { startDate, endDate, keyword } = filterParams;
  const [itemTitle, setItemTitle] = useState<string>('');
  const { getSavedItems } = useContext(AppContext);

  const handleInput = (param: string, value: string | Dayjs | null) => {
    setFilterParams({
      ...filterParams, [param]: value
    });
  }

  return (
    <SearchWrapper>
      <SearchRow>
        <SearchInput
          value={keyword ? keyword : ''}
          name="keyword"
          placeholder="Keyword"
          onChange={({ target }) => handleInput('keyword', target.value)}
        />
        <SearchButton
          onClick={async () => await getSavedItems()}
        >
          Search
        </SearchButton>
      </SearchRow>
      <DateRow>
        <LocalizationProvider
          localeText={enUS.components.MuiLocalizationProvider.defaultProps.localeText}
          dateAdapter={AdapterDayjs}
          adapterLocale="en-gb"
        >
          <DemoContainer components={['DatePicker', 'DatePicker']} sx={{mr: 2, mb: 2, ml: 2}}>
            <DatePicker
              value={startDate}
              onChange={(newValue: Dayjs | null) => handleInput('startDate', newValue)}
              format="DD/MM/YYYY"
              label="Start Date"
            />
            <DatePicker
              // value={dayjs(new Date(2020, 2, 3))}
              value={endDate}
              onChange={(newValue: Dayjs | null) => handleInput('endDate', newValue)}
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
      </DateRow>
    </SearchWrapper>
  );
}
