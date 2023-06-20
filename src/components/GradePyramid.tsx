import React, { ReactElement } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { getColorForIndex } from "../lib/helpers";

type GradePyramidProps = {
  chartData: Record<string, number | string>[];
  setSelectedGrade: (grade: string) => void;
};

const GradePyramid = ({ chartData, setSelectedGrade }: GradePyramidProps): ReactElement => {

  const handleChartClick = (activeLabel: string | undefined) => {
    if (typeof activeLabel === 'string') {
      setSelectedGrade(activeLabel);
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
      <XAxis dataKey="grade" />
      <YAxis />
      <Tooltip />
      <Bar
        dataKey={'count'}
        fill={getColorForIndex(1)}
      />
    </BarChart>
  );
};

export default GradePyramid;