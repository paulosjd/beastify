import React, { ReactElement } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { getColorForIndex } from "../lib/helpers";

type DateItem = {
  date: string;
};

type ChartDataItem = DateItem | Record<string, number>;

type GradePyramidProps = {
  chartData: ChartDataItem[] | [];
  setSelectedDate: (dt: string) => void;
};

export default function GradeByDate({ chartData, setSelectedDate }: GradePyramidProps): ReactElement {

  const grades: Set<string> = new Set();
  chartData
    .forEach(item => Object.keys(item)
      .filter(key => key !== 'date')
      .forEach(gradeKey => grades.add(gradeKey))
    );

  const handleChartClick = (activeLabel: string | undefined) => {
    if (typeof activeLabel === 'string') {
      setSelectedDate(activeLabel);
    }
  }

  return (
    <BarChart
      width={chartData.length > 10 ? 1200 : 800}
      height={500}
      data={chartData}
      onClick={({activeLabel}) => handleChartClick(activeLabel)}
      margin={{ right: 35, top: 8 }}
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
        ))}
    </BarChart>
  );
};
