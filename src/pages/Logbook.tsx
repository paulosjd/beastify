import React, { ReactElement, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import useGoogleSheets from "use-google-sheets";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import styled from "styled-components";
import { AppContext, filterParamsTypes } from "../AppContext";
import Button from "../components/Button";
import Input from "../components/Input";
import ArticleTags from "../components/ArticleTags";
import TextArea from "../components/TextArea";
import GradePyramid from "../components/GradePyramid";
import Search from "../components/Search";
import { Spacing, Wrapper } from "../components/StyledComponents";
import { groupByKey, monthToNumber, sortDateStrings } from "../helpers"
import GradeByDate from "../components/GradeByDate";


const ArticlesWrapper = styled(Wrapper)`
  max-width: 1320px;
`;

const SavedItemWrapper = styled.div`
  width: 100%;
  overflow: auto;
`;

const AddItemButton = styled(Button)`
  min-height: 45px;
`;

const AddItemWrapper = styled.div`
  margin-top: 25px;
  margin-bottom: 10px;
  width: 100%
`;

export const filterParamsInitialState = {
  startDate: null,
  endDate: null,
  keyword: null
};

type LogItem = {
  [key: string]: string;
  route: string;
  grade: string;
  date: string;
  crag: string;
}

type Timeframe = 0 | 0.5 | 1 | 3 | 5 | 10

export default function Logbook(): ReactElement {
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");

  const [timeframe, setTimeframe] = useState<number>(1);
  const [climbType, setClimbType] = useState<string>('boulder');
  const [filterParams, setFilterParams] = useState<filterParamsTypes>(filterParamsInitialState);
  const { addArticle, getSavedArticles, savedArticles, currentUser } = useContext(AppContext);

  const handleTimeframeChange = (value: number | string ) => {
    if (typeof value === 'number') {
      setTimeframe(value);
    }
  };

  const sheetsObj = {
    apiKey: process.env.REACT_APP_SHEETS_API_KEY || '',
    sheetId: process.env.REACT_APP_SHEET_ID || '',
  };

  const { data, loading, error } = useGoogleSheets(sheetsObj);

  if (loading) {
    return (
      <Wrapper>
        <CircularProgress />
      </Wrapper>
    )
  }
  console.log(error)

  // TODO loading symbol, suspense?

  // TODO input for sheet id ?? - error handling if that doesn't return anything

  // TODO filter by last 1, 5 years


  // console.log(error)
  let logData: LogItem[];
  let chartData = [];

  const sheetData = !!data.length && data[0].data ? data[0].data : [];
  if (!sheetData.length) {
    return (
      <Wrapper>
        <h1>No Data</h1>
      </Wrapper>
    )
  }

  logData = sheetData.map((obj: Record<string,any>): LogItem => ({
    route: obj['Climb name'],
    grade: obj['Grade'],
    date: obj['Date'],
    crag: obj['Crag name']
  }))

  logData = logData.filter((obj: LogItem) => !!obj.grade && !!obj.date);
  logData = logData.map((obj: LogItem): LogItem => ({
    ...obj,
    grade: obj.grade.split(' ')[0],
    date: '01/'.concat(obj.date.split('/').slice(1,3).join('/'))
  }))

  let re: RegExp
  if (climbType === 'boulder') {
    re = /^f\d[ABC]\+?$/;  // \+? means optional plus sign and dollar is end of string
  } else {
    re = /^F\d[abc]\+?$/;
  }
  logData = logData.filter((obj: LogItem) => re.test(obj.grade));
  const groupedData = groupByKey<LogItem>(logData, 'date');

  // TODO filter by last 1, 5 years  - just check e.g. parseInt('23') within range 18-23

  let minGrade: string | undefined;
  let maxGrade: string | undefined;

  type ChartDateItem = {
    [key: string]: number | string;
    date: string;
  }

  const sortedDates = sortDateStrings(Object.keys(groupedData).map(dt => {
    const parts = dt.split('/');
    if (parts.length === 3) {
      parts[1] = monthToNumber(parts[1]);
      if (parts[1]) {
        return parts.join('/');
      }
    }
    return ''
  }))
    .filter(dt => dt.length === 8).map(dt => {
      return dt.slice(0, 2).concat('/', monthToNumber(dt.slice(3, 5), true), '/', dt.slice(6, 8));
  })
    .reverse();

  let dateKeys: string[];
  if (timeframe === 0) {
    dateKeys = sortedDates;
  } else {
    dateKeys = [];
    const now = new Date();
    for (let dateStr of sortedDates) {
      const dateParts = dateStr.split('/');
      [dateParts[0], dateParts[1]] = [dateParts[1], dateParts[0]];
      const date = new Date(dateParts.join('/'));
      date.setMonth(date.getMonth() + (timeframe * 12));
      if (date < now) {
        break;
      }
      dateKeys.push(dateStr);
    }
  }
  // dateKeys = dateKeys.slice(Math.max(dateKeys.length - 10, 0))  // Get the last 10 items

  // just display maxGrade on screen, no need for it on chart data

  for (const date of dateKeys.reverse()) {
    const chartItem: ChartDateItem = {
      date,
    }
    const logItemList = groupedData[date];
    for (const logItem of logItemList) {
      if (!minGrade || logItem.grade < minGrade) {
        minGrade = logItem.grade;
      }
      if (!maxGrade || logItem.grade > minGrade) {
        maxGrade = logItem.grade;
      }
      const gradeCount = chartItem[logItem.grade];
      if (typeof gradeCount === 'number') {
        chartItem[logItem.grade] = gradeCount + 1;
      } else {
        chartItem[logItem.grade] = 1;
      }
    }
    chartData.push(chartItem);
  }

  console.log(chartData)

  // TODO func that makes grade range from min to max


  return (
    <Wrapper>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Timeframe</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={timeframe}
          label="Timeframe"
          onChange={({ target }) => handleTimeframeChange(target.value)}
        >
          <MenuItem value={0.5}>6 Months</MenuItem>
          <MenuItem value={1}>1 year</MenuItem>
          <MenuItem value={3}>3 years</MenuItem>
          <MenuItem value={5}>5 years</MenuItem>
          <MenuItem value={10}>10 years</MenuItem>
          <MenuItem value={0}>All</MenuItem>
        </Select>
      </FormControl>
      <GradeByDate
        chartData={chartData}
      />
      {/*<GradePyramid*/}
      {/*  chartData={data2}*/}
      {/*/>*/}
    </Wrapper>
  )
}
