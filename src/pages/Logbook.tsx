import React, { ReactElement, useContext, useState } from "react";
import useGoogleSheets from "use-google-sheets";
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Wrapper } from "../components/StyledComponents";
import { groupByKey, monthToNumber, sortDateStrings } from "../helpers"
import GradeByDate from "../components/GradeByDate";
import NoData from "../components/NoData";
import styled from "styled-components";

const LogbookWrapper = styled(Wrapper)`
  margin-top: 15px;
`;

type LogItem = {
  [key: string]: string;
  route: string;
  grade: string;
  date: string;
  crag: string;
}

export default function Logbook(): ReactElement {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [timeframe, setTimeframe] = useState<number>(1);
  const [climbType, setClimbType] = useState<string>('boulder');
  const [chartType, setChartType] = useState<string>('date');

  const handleTimeframeChange = (value: number | string ) => {
    if (typeof value === 'number') {
      setTimeframe(value);
    }
  };

  const sheetsObj = {
    apiKey: process.env.REACT_APP_SHEETS_API_KEY || '',
    sheetId: process.env.REACT_APP_SHEET_ID || '',
  };

  const { data, loading } = useGoogleSheets(sheetsObj);

  if (loading) {
    return (
      <Wrapper>
        <CircularProgress sx={{ mt: 30 }} />
      </Wrapper>
    );
  }

  let logData: LogItem[];
  let chartData = [];

  const sheetData = !!data.length && data[0].data ? data[0].data : [];
  if (!sheetData.length) {
    return <NoData wrapper={LogbookWrapper} />;
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
    re = /^F?\d[abc]\+?$/;
  }
  logData = logData.filter((obj: LogItem) => re.test(obj.grade));
  const groupedData = groupByKey<LogItem>(logData, 'date');

  let selectedLogItems: LogItem[] | undefined;
  if (selectedDate) {
    selectedLogItems = groupedData[selectedDate];
  }

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

  for (const date of dateKeys.reverse()) {
    const chartItem: ChartDateItem = {
      date,
    }
    const logItemList = groupedData[date];
    for (const logItem of logItemList) {
      const gradeCount = chartItem[logItem.grade];
      if (typeof gradeCount === 'number') {
        chartItem[logItem.grade] = gradeCount + 1;
      } else {
        chartItem[logItem.grade] = 1;
      }
    }
    chartData.push(chartItem);
  }

  if (!chartData.length) {
    return <NoData wrapper={LogbookWrapper} />;
  }

  const handleChartTypeChange = (target: HTMLButtonElement) => {
    setChartType(target.value);
    setSelectedDate('');
  }

  return (
    <LogbookWrapper>
      <div>
        <FormControl>
          <InputLabel>Timeframe</InputLabel>
          <Select
            sx={{mx: 1, minWidth: '120px'}}
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
        <FormControl>
          <InputLabel>Style</InputLabel>
          <Select
            sx={{mx: 1, minWidth: '120px'}}
            value={climbType}
            label="Style"
            onChange={({ target }) => setClimbType(target.value.toString())}
          >
            <MenuItem value={'boulder'}>Boulder</MenuItem>
            <MenuItem value={'sport'}>Sport climbing</MenuItem>
          </Select>
        </FormControl>
        <ToggleButtonGroup
          color="primary"
          value={chartType}
          exclusive
          onChange={({ target }) => handleChartTypeChange(target as HTMLButtonElement)}
          sx={{ ml:1, height: '56px' }}
        >
          <ToggleButton value="date">Date series</ToggleButton>
          <ToggleButton value="pyramid">Pyramid</ToggleButton>
        </ToggleButtonGroup>
      </div>
      {chartType === 'pyramid' ? (
          <h1>pyramid chart</h1>
        ): (
          <GradeByDate
            chartData={chartData}
            setSelectedDate={setSelectedDate}
          />
      )}
      {selectedLogItems && (
        <TableContainer component={Paper} sx={{ maxWidth: 1200 }} >
          <Table>
            <TableHead>
              <TableRow>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedLogItems.map((row) => (
                <TableRow
                  key={row.route}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{row.route}</TableCell>
                  <TableCell sx={{textAlign: 'left'}}>{row.grade}</TableCell>
                  <TableCell align="right">{row.crag}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </LogbookWrapper>
  )
}
