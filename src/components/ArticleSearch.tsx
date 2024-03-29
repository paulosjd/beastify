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
import { filterParamsInitialState } from "../pages/Articles";
import { ArticleFilterParamsType } from "../lib/types";
import {IconButton} from "@mui/material";
import Clear from "@mui/icons-material/Clear";
import Button from "./Button";

const SearchWrapper = styled.div`
  margin-bottom: 15px;
`;

const SearchButton = styled(Button)`
  width: 120px;
  height: 42px;
  background-color: #1976d2;
  margin: 15px;
`;

const Row = styled.div`
  display: flex;
`;

const SearchInput = styled(Input)`
  width: 280px;
  height: 48px;
  margin-top: 8px;
`;

interface searchProps {
  filterParams: ArticleFilterParamsType;
  setFilterParams: (params: ArticleFilterParamsType) => void;
}

export default function ArticleSearch({ filterParams, setFilterParams }: searchProps): ReactElement {

  const { startDate, endDate, keyword } = filterParams;
  const { getSavedArticles } = useContext(AppContext);

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
      <Row>
        <SearchInput
          value={keyword ? keyword : ''}
          name="keyword"
          placeholder="Keyword"
          onChange={({ target }) => handleInput('keyword', target.value)}
        />
        <LocalizationProvider
          localeText={enUS.components.MuiLocalizationProvider.defaultProps.localeText}
          dateAdapter={AdapterDayjs}
          adapterLocale="en-gb"
        >
          <DemoContainer components={['DatePicker', 'DatePicker']} sx={{mr: 2, ml: 2}}>
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
          sx={{}}
          component="label"
          style={{borderRadius: 0.5}}
          onClick={resetInput}
        >
          <Clear />
        </IconButton>
        <SearchButton
          onClick={async () => await getSavedArticles(filterParams)}
          disabled={!Object.values(filterParams).some(val => !!val) || hasInvalidDate}
        >
          Search
        </SearchButton>
      </Row>
    </SearchWrapper>
  );
}
