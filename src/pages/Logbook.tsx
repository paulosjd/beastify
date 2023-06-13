import React, { ReactElement, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import useGoogleSheets from "use-google-sheets";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from "styled-components";
import { AppContext, filterParamsTypes } from "../AppContext";
import Button from "../components/Button";
import Input from "../components/Input";
import ArticleTags from "../components/ArticleTags";
import TextArea from "../components/TextArea";
import GradePyramid from "../components/GradePyramid";
import Search from "../components/Search";
import { Spacing, Wrapper } from "../components/StyledComponents";
import { groupByKey, monthToNumber } from "../helpers"


const ArticlesWrapper = styled(Wrapper)`
  max-width: 1320px;
`;

const SavedItemWrapper = styled.div`
  width: 100%;
  overflow: auto;
`;

const AddItemButton = styled(Button)`
  min-height: 45px;
`;

const AddItemWrapper = styled.div`
  margin-top: 25px;
  margin-bottom: 10px;
  width: 100%
`;

export const filterParamsInitialState = {
  startDate: null,
  endDate: null,
  keyword: null
};

interface LogItem {
  [key: string]: string;
  route: string;
  grade: string;
  date: string;
  crag: string;
}

export default function Logbook(): ReactElement {
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [editItemId, setEditItemId] = useState<string>("");
  const [viewItemId, setViewItemId] = useState<string>("");
  const [climbType, setClimbType] = useState<string>('boulder');
  const [filterParams, setFilterParams] = useState<filterParamsTypes>(filterParamsInitialState);
  const { addArticle, getSavedArticles, savedArticles, currentUser } = useContext(AppContext);

  useEffect(() => {
    // getSavedArticles();
    // eslint-disable-next-line
  }, [currentUser]);

  console.log(process.env.REACT_APP_SHEETS_API_KEY)
  console.log(process.env.REACT_APP_SHEET_ID)


  const sheetsObj = {
    apiKey: process.env.REACT_APP_SHEETS_API_KEY || '',
    sheetId: process.env.REACT_APP_SHEET_ID || '',
    // sheetsOptions: [{ id: 'Sheet1' }],  // optional
  }

  const { data, loading, error } = useGoogleSheets(sheetsObj);

  // TODO input for sheet id ?? - error handling if that doesn't return anything

  // console.log('data:')
  // console.log(data)
  // console.log('loading:')
  // console.log(loading)
  // console.log('error:')
  // console.log(error)
  let logData: LogItem[];
  // const chartData = [];

  const sheetData = !!data.length && data[0].data ? data[0].data : [];

  logData = sheetData.map((obj: Record<string,any>): LogItem => ({
    route: obj['Climb name'],
    grade: obj['Grade'],
    date: obj['Date'],
    crag: obj['Crag name']
  }))

  logData = logData.filter((obj: LogItem) => !!obj.grade && !!obj.date)
  logData = logData.map((obj: LogItem): LogItem => ({
    ...obj,
    grade: obj.grade.split(' ')[0],
    date: obj.date.replace('??', '01')
  }))

  let re: RegExp
  if (climbType === 'boulder') {
    re = /^f\d[ABC]\+?$/;  // \+? means optional plus sign and dollar is end of string
  } else {
    re = /^F\d[abc]\+?$/;
  }
  logData = logData.filter((obj: LogItem) => re.test(obj.grade))

  const groupedData = groupByKey<LogItem>(logData, 'date');
  console.log(groupedData)
  // for (const date of Object.keys(groupedData))




  // const chartData = [{date: "01/May/23", count: 4}]



  const data2 = [
    {
      date: 'Page E',
      uv: 1890,
      pv: 4800,
    },
    {
      date: 'Page F',
      uv: 2390,
    }
  ];


  return (
    <Wrapper>
      <GradePyramid
        chartData={data2}
      />
    </Wrapper>
  )
}
