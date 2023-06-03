import React, { ReactElement, useState } from "react";
import { Link, IconButton } from "@mui/material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import styled from "styled-components";
import Button from "./Button";
import Input from "./Input";
import { AppContext, savedItemInterface } from "../AppContext";
import { Spacing } from "./StyledComponents";
import TextArea from "./TextArea";
import styles from "./styles.module.css";
import ArticleTags from "./ArticleTags";

interface LogItem{
  grade: string;
  count: number;
}

interface GradePyramidProps {
  logData: LogItem[];
}

export default function GradePyramid({ logData }: GradePyramidProps): ReactElement {

  return (
    <BarChart
      width={500}
      height={300}
      data={logData}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#8884d8" />
      <Bar dataKey="uv" fill="#82ca9d" />
    </BarChart>
  );
}
