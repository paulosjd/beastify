import React, { ReactElement, useState } from "react";
import useGoogleSheets from "use-google-sheets";
import CircularProgress from '@mui/material/CircularProgress';
import { Line, LineChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { getColorForIndex } from "../lib/helpers";
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

type PyramidItem = {
  grade: string;
  count: number;
};

const data4reps = [
  { date: '10/02/2023', fours: '38.5' },
  { date: '14/02/2023', fours: '38.75' },
  { date: '24/02/2023', fours: '38.75' },
  { date: '14/03/2023', fours: '39.25' },
  { date: '14/02/2023', fours: '39.25' },
]

const data3reps = [
  { date: '10/02/2023', threes: '41.5' },
  { date: '14/02/2023', threes: '41.75' },
  { date: '24/02/2023', threes: '42.5' },
  { date: '14/03/2023', threes: '42.5' },
  { date: '14/02/2023', threes: '42.75' },
]

const data = [
  { date: '10/02/2023', fours: '38.5', threes: '41.5' },
  { date: '14/02/2023', fours: '38.75', threes: '41.75' },
  { date: '24/02/2023', fours: '38.75', threes: '42.5' },
  { date: '14/03/2023', fours: '39.25', threes: '42.5' },
  { date: '14/02/2023', fours: '39.25', threes: '42.75' },
]

const Tracker = (): ReactElement => {
  const [selectedDate, setSelectedDate] = useState<string>('');

  return (
    <LogbookWrapper>
      <LineChart
        width={data.length > 10 ? 1200 : 800}
        height={500}
        data={data}
        margin={{ right: 35, top: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {['fours', 'fives'].map((item, ind) => (
          <Line
            key={item}
            dataKey={item}
            stroke={getColorForIndex(ind)}
          />
        ))}
      </LineChart>
    </LogbookWrapper>
  )
}

export default Tracker;
