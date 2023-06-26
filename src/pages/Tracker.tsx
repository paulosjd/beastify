import React, { ReactElement, useState } from "react";
import useGoogleSheets from "use-google-sheets";
import CircularProgress from '@mui/material/CircularProgress';
import { Line, LineChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { getColorForIndex, dateFromTimestamp } from "../lib/helpers";
import { NoDataParagraph, Wrapper } from "../components/StyledComponents";
import styled from "styled-components";

const LogbookWrapper = styled(Wrapper)`
  margin-top: 15px;
`;

const Tracker = (): ReactElement => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const lineColors = ['#1F77B4', '#ff7f0e', '#2ca02c', '#9467bd', '#bcbd22'];

  const sheetsObj = {
    apiKey: process.env.REACT_APP_SHEETS_API_KEY || '',
    sheetId: process.env.REACT_APP_PULLUPS_SHEET_ID || '',
  };

  const { data, loading } = useGoogleSheets(sheetsObj);

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

  const chartData: Record<string, string | number>[] = [];
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

  return (
    <LogbookWrapper>
      <LineChart
        width={chartData.length > 10 ? 1200 : 800}
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
          name={'Date'}
          tickFormatter={dateFromTimestamp}
        />
        <YAxis />
        <Tooltip labelFormatter={dateFromTimestamp} />
        <Legend />
        {['1r', '2r', '3r', '4r', '5r'].map((item, ind) => (
          <Line
            key={item}
            dataKey={item}
            connectNulls
            stroke={getColorForIndex(ind, lineColors)}
          />
        ))}
      </LineChart>
    </LogbookWrapper>
  )
}

export default Tracker;
