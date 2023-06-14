import React, { ReactElement, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import styled from "styled-components";
import {monthToNumber} from "../helpers";


type DateItem = {
  date: string;
}

type ChartDataItem = DateItem | Record<string, number>;

type GradePyramidProps = {
  chartData: ChartDataItem[] | [];
}

export default function GradeByDate({ chartData }: GradePyramidProps): ReactElement {
  const grades: Set<string> = new Set();
  chartData
    .forEach(item => Object.keys(item)
      .filter(key => key !== 'date')
      .forEach(gradeKey => grades.add(gradeKey))
    );

  console.log(grades)

  return (
    <BarChart
      width={1000}
      height={600}
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
      { Array.from(grades).map(item => (<Bar key={item} dataKey={item} fill="#8884d8" />))

      }



    </BarChart>
  );
}
