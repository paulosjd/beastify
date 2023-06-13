import React, { ReactElement, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import styled from "styled-components";
import {monthToNumber} from "../helpers";


type ChartDataItem = {
  date: string;
  uv?: number;
  pv?: number
}

interface GradePyramidProps {
  chartData: ChartDataItem[] | [];
}

export default function GradePyramid({ chartData }: GradePyramidProps): ReactElement {

  return (
    <BarChart
      width={500}
      height={300}
      data={chartData}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Bar dataKey="uv" fill="#8884d8" />
      <Bar dataKey="pv" fill="#8884d8" />


    </BarChart>
  );
}
