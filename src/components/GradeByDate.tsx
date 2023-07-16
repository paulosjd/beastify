import React, { ReactElement } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { getColorForIndex } from "../lib/helpers";

type DateItem = {
  date: string;
};

type ChartDataItem = DateItem | Record<string, number>;

type GradePyramidProps = {
  chartData: ChartDataItem[] | [];
  grades: string[];
  setSelectedDate: (dt: string) => void;
};

export default function GradeByDate({ chartData, grades, setSelectedDate,  }: GradePyramidProps): ReactElement {

  const handleChartClick = (activeLabel: string | undefined) => {
    if (typeof activeLabel === 'string') {
      setSelectedDate(activeLabel);
    }
  }

  return (
    <BarChart
      width={chartData.length > 7 ? 1200 : 800}
      height={500}
      data={chartData}
      onClick={({activeLabel}) => handleChartClick(activeLabel)}
      margin={{ right: 35, top: 8 }}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false}/>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      {grades.map((item, ind) => (
          <Bar
            key={item}
            dataKey={item}
            fill={getColorForIndex(ind)}
          />
        ))}
    </BarChart>
  );
};
