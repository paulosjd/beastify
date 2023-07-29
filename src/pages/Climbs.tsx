import React, { ReactElement, useState } from "react";
import useGoogleSheets from "use-google-sheets";
import CircularProgress from '@mui/material/CircularProgress';
import { Line, LineChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, TooltipProps } from "recharts";
import { ValueType, NameType, } from 'recharts/types/component/DefaultTooltipContent';
import { getColorForIndex, dateFromTimestamp, linearRegression } from "../lib/helpers";
import { NoDataParagraph, Wrapper } from "../components/StyledComponents";
import styled from "styled-components";
import TrackerOptions from "../components/TrackerOptions";

const LogbookWrapper = styled(Wrapper)`
  margin-top: 15px;
`;

const TooltipWrapper = styled.div`
  border: 1px solid #717171;
  background-color: #FFF;
  padding: 2px 4px 0 4px;
`;

const Climbs = (): ReactElement => {

  const [chartType, setChartType] = useState<string>('absolute');

  return (
    <LogbookWrapper>
      <p>foo</p>
    </LogbookWrapper>
  )
}

export default Climbs;
