import React, { ReactElement, useState } from "react";
import useGoogleSheets from "use-google-sheets";
import CircularProgress from '@mui/material/CircularProgress';
import { Wrapper } from "../components/StyledComponents";
import { countForKey, getLogitemId, groupByKey, monthToNumber, sortDateStrings } from "../lib/helpers"
import { LogItem } from "../lib/types"
import GradeByDate from "../components/GradeByDate"
import LogbookOptions from "../components/LogbookOptions";
import styled from "styled-components";
import GradePyramid from "../components/GradePyramid";
import RoutesTable from "../components/RoutesTable";

const LogbookWrapper = styled(Wrapper)`
  margin-top: 15px;
`;

const NoDataParagraph = styled.p`
  font-size: 20px;
  color: #1E2828FF;
  margin-top: 40px;
`;

type PyramidItem = {
  grade: string;
  count: number;
};

const Logbook = (): ReactElement => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [timeframe, setTimeframe] = useState<number>(1);
  const [climbType, setClimbType] = useState<string>('boulder');
  const [chartType, setChartType] = useState<string>('date');

  const handleTimeframeChange = (value: number | string ) => {
    if (typeof value === 'number') {
      setTimeframe(value);
    }
  };

  const handleChartTypeChange = (target: HTMLButtonElement) => {
    setChartType(target.value);
    setSelectedDate('');
  }

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

  const logbookOptions = (
    <LogbookOptions
      timeframe={timeframe}
      handleTimeframeChange={handleTimeframeChange}
      climbType={climbType}
      setClimbType={setClimbType}
      chartType={chartType}
      handleChartTypeChange={handleChartTypeChange}
    />
  );

  const noData = (
    <LogbookWrapper>
      {logbookOptions}
      <NoDataParagraph>No data available</NoDataParagraph>
    </LogbookWrapper>
  );

  const sheetData = !!data.length && data[0].data ? data[0].data : [];
  if (!sheetData.length) {
    return noData;
  }

  logData = sheetData.map((obj: Record<string,any>): LogItem => ({
    id: '',
    route: obj['Climb name'],
    grade: obj['Grade'],
    date: obj['Date'],
    crag: obj['Crag name']
  }));

  // TODO make unique id's from logitem - name/date/crag_ind ?? to use as key prop and as way of making request to update sheets (api request)
  // - for add e.g. notes or edit item ?
  // way to add to logbook ? ie can start with blank logbook/sheet not from ukc


  logData = logData.filter((obj: LogItem) => !!obj.grade && !!obj.date);
  logData = logData.map((obj: LogItem): LogItem => ({
    ...obj,
    grade: obj.grade.split(' ')[0],
    date: '01/'.concat(obj.date.split('/').slice(1,3).join('/'))
  }));

  const logitemIds: string[] = [];
  logData = logData.map((obj: LogItem): LogItem => {
    const id = getLogitemId(obj);
    logitemIds.push(id)
    return { ...obj, id  }
  });
  console.log(logData)

  // Remove any duplicates
  logData = logData.filter((item, index, itemArray) => {
    return index === itemArray.findIndex(
      (t) => t.id === item.id)
  })

  console.log(logData)

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

  const dates = Object.keys(groupedData).map(dt => {
    const parts = dt.split('/');
    if (parts.length === 3) {
      parts[1] = monthToNumber(parts[1]);
      if (parts[1]) {
        return parts.join('/');
      }
    }
    return '';
  });

  const sortedDates = sortDateStrings(dates)
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

  if (chartType === 'pyramid') {
    let chartData: PyramidItem[] = [];
    const itemsInDate = logData.filter(item => dateKeys.includes(item.date));
    const gradeCounts = countForKey(itemsInDate, 'grade');
    for (const [grade, count] of Object.entries(gradeCounts)) {
      chartData.push({ grade, count });
      chartData = chartData.sort(
        (a, b) => a.grade > b.grade ? 1 : a.grade === b.grade ? 0 : -1
      )
    }
    let gradeItems: LogItem[] | undefined;
    if (selectedGrade) {
      const itemsByGrade = groupByKey<LogItem>(itemsInDate, 'grade');
      gradeItems = itemsByGrade[selectedGrade]
    }

    return (
      <LogbookWrapper>
        {logbookOptions}
        <GradePyramid
            chartData={chartData}
            setSelectedGrade={setSelectedGrade}
        />
        {gradeItems && <RoutesTable tableData={gradeItems}/>}
      </LogbookWrapper>
    )
  }

  const chartData = [];
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
    return noData;
  }

  return (
    <LogbookWrapper>
      {logbookOptions}
      <GradeByDate
        chartData={chartData}
        setSelectedDate={setSelectedDate}
      />
      {selectedLogItems && <RoutesTable tableData={selectedLogItems}/>}
    </LogbookWrapper>
  )
}

export default Logbook;
