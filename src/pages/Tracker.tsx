import React, { ReactElement, useState } from "react";
import useGoogleSheets from "use-google-sheets";
import CircularProgress from '@mui/material/CircularProgress';
import { Line, LineChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { getColorForIndex, dateFromTimestamp, linearRegression } from "../lib/helpers";
import { NoDataParagraph, Wrapper } from "../components/StyledComponents";
import styled from "styled-components";
import TrackerOptions from "../components/TrackerOptions";

const LogbookWrapper = styled(Wrapper)`
  margin-top: 15px;
`;

const Tracker = (): ReactElement => {
  const [chartType, setChartType] = useState<string>('absolute');
  const lineColors = ['#1F77B4', '#ff7f0e', '#2ca02c', '#9467bd', '#bcbd22'];

  const showWeightLine = chartType === 'bodyWeight';

  const sheetsObj = {
    apiKey: process.env.REACT_APP_SHEETS_API_KEY || '',
    sheetId: process.env.REACT_APP_PULLUPS_SHEET_ID || '',
  };

  const { data, loading } = useGoogleSheets(sheetsObj);
  let { data: bwSheetData } = useGoogleSheets({
    ...sheetsObj, sheetId: process.env.REACT_APP_BODYWEIGHT_SHEET_ID || ''
  });

  if (loading) {
    return (
      <Wrapper>
        <CircularProgress sx={{ mt: 30 }} />
      </Wrapper>
    );
  }

  const noData = (
    <LogbookWrapper>
      <NoDataParagraph>No data available</NoDataParagraph>
    </LogbookWrapper>
  );

  let sheetData: Record<string, any>[] = !!data.length && data[0].data ? data[0].data : [];
  if (!sheetData.length) {
    return noData;
  }

  sheetData = sheetData
    .filter(row => [row.Date, row.Weight, row.Reps].every(i => !!i))
    .filter(row => ['1', '2', '3', '4', '5'].includes(row.Reps))
    .filter(row => !isNaN(parseFloat(row.Weight)));

  // TODO CustomContentOfTooltip ??  - notes column on spreadsheet and include in tooltip

  let chartData: Record<string, string | number>[] = [];
  for (let row of sheetData) {
    const { Date: date, Weight: weight, Reps: reps } = row;
    const time = (new Date(date)).getTime();
    if (isNaN(time)) {
      continue;
    }
    let dataObj = chartData.find(d => d.time === time);
    if (dataObj) {
      dataObj[`${reps}r`] = weight;
    } else {
      chartData.push({ time, [`${reps}r`]: weight });
    }
  }
  chartData = chartData.sort((a, b) => a.time > b.time ? 1 : a.time === b.time ? 0 : -1);

  let bwSheet: Record<string, any>[] = !!bwSheetData.length && bwSheetData[0].data ? bwSheetData[0].data : [];
  bwSheet = bwSheet
    .filter(row => [row.Date, row.Weight].every(i => !!i))
    .filter(row => !isNaN(parseFloat(row.Weight)))

  const bwData: Record<string, string | number>[] = [];
  if (!!bwSheet.length) {
    for (let row of bwSheet) {
      let { Date: date, Weight: weight } = row;
      weight = parseFloat(weight)
      if (isNaN(weight)) {
        continue;
      }
      const time = (new Date(date)).getTime();
      if (isNaN(time)) {
        continue;
      }
      bwData.push({ time, weight });
    }
  }

  const dataKeys = ['1r', '2r', '3r', '4r', '5r'];

  if (showWeightLine) {
    const newChartData: Record<string, string | number>[] = [];
    for (let record of chartData) {
      const recordDate = new Date(record.time);
      const beforeTime = new Date(recordDate.setDate(recordDate.getDate() - 28)).getTime();
      const afterTime = new Date(recordDate.setDate(recordDate.getDate() + 28)).getTime();
      const bwRecs = [];
      for (let bwRec of bwData) {
        if (bwRec.time >= beforeTime && bwRec.time <= afterTime) {
          bwRecs.push({ ...bwRec, time: bwRec.time });
        }
      }
      if (!!bwRecs.length && bwRecs.length > 3) {
        const calcBodyWeight = linearRegression(bwRecs, 'time', 'weight');
        const bodyWeight = calcBodyWeight(record.time);
        if (!isNaN(bodyWeight)) {
          const newObj: Record<string, string | number> = { time: record.time };
          for (let [key, value] of Object.entries(record)) {
            if (dataKeys.includes(key) && typeof value === 'string' && !isNaN(parseFloat(value))) {
              value = ((parseFloat(value) / bodyWeight) * 100).toFixed(2);
              newObj[key] = value;
            }
          }
          newChartData.push({ ...newObj, bodyWeight: bodyWeight.toFixed(2) });
        }
      }
    }
    chartData = newChartData;
  }

  return (
    <LogbookWrapper>
      <TrackerOptions
        chartType={chartType}
        setChartType={setChartType}
      />
      <LineChart
        width={chartData.length > 10 ? 1280 : 800}
        height={500}
        data={chartData}
        margin={{ right: 35, top: 8 }}
      >
        <CartesianGrid
          strokeDasharray={"3 3"}
          vertical={false}
        />
        <XAxis
          dataKey={'time'}
          type={'number'}
          domain={['auto', 'auto']}
          scale={'time'}
          minTickGap={50}
          name={'Date'}
          tickFormatter={dateFromTimestamp}
        />
        <YAxis />
        <Tooltip labelFormatter={dateFromTimestamp} />
        <Legend />
        {dataKeys.map((item, ind) => (
          <Line
            key={item}
            dataKey={item}
            connectNulls
            stroke={getColorForIndex(ind, lineColors)}
          />
        ))}
        {showWeightLine && (
          <Line
            dataKey={'bodyWeight'}
            connectNulls
            dot={false}
            stroke={'#7d8fa4'}
            strokeDasharray={"3 3"}
          />
        )}
      </LineChart>
    </LogbookWrapper>
  )
}

export default Tracker;
