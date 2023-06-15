import React, { ReactElement, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import styled from "styled-components";
import { getColorForIndex } from "../helpers";


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

  // TODO dyanimcally generate fill and add legend

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
      <Tooltip />
      <Legend />
      {Array.from(grades)
        .sort((a: string, b: string) => a > b ? 1 : a === b ? 0 : -1)
        .map((item, ind) => (
          <Bar
            key={item}
            dataKey={item}
            fill={getColorForIndex(ind)}
          />
        )) }



    </BarChart>
  );
}
