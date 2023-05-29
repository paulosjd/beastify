import React, { ReactElement, useContext, useState } from "react";
import { DatePicker } from '@mui/x-date-pickers-pro';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import { enUS } from '@mui/x-date-pickers/locales';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import styled from "styled-components";
import Input from "./Input";
import { AppContext } from "../AppContext";
import { filterParamsInitialState } from "../pages/Home";
import { filterParamsTypes } from "../AppContext";
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
  background-color: #1976d2;
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
  const { getSavedItems } = useContext(AppContext);

  const handleInput = (param: string, value: string | Dayjs | null) => {
    let newFilterParams = { ...filterParams };
    if (param === 'keyword') {
      newFilterParams = { ...filterParamsInitialState };
    } else {
      newFilterParams.keyword = '';
    }
    setFilterParams({
      ...newFilterParams, [param]: value
    });
  };

  const resetInput = () => {
    setFilterParams(filterParamsInitialState);
  };

  const hasInvalidDate = !!((filterParams.startDate && !filterParams.startDate.isValid()) ||
    (filterParams.endDate && !filterParams.endDate.isValid()));

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
          onClick={async () => await getSavedItems(filterParams)}
          disabled={!Object.values(filterParams).some(val => !!val) || hasInvalidDate}
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
          onClick={resetInput}
        >
          <Clear />
        </IconButton>
      </DateRow>
    </SearchWrapper>
  );
}
