import React, { ReactElement, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from "styled-components";
import { AppContext, filterParamsTypes } from "../AppContext";
import Button from "../components/Button";
import Input from "../components/Input";
import ArticleTags from "../components/ArticleTags";
import TextArea from "../components/TextArea";
import SavedArticle from "../components/SavedArticle";
import Search from "../components/Search";
import { Spacing, Wrapper } from "../components/StyledComponents";
import useGoogleSheets from "use-google-sheets";


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

export default function Logbook(): ReactElement {
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [editItemId, setEditItemId] = useState<string>("");
  const [viewItemId, setViewItemId] = useState<string>("");
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
  // todo handle if error, while loading
  console.log('data:')
  console.log(data)
  console.log('loading:')
  console.log(loading)
  console.log('error:')
  console.log(error)
  const logData = !!data.length && data[0].data ? data[0].data : [];
  const chartData = [];

  // const quantity = transactionStore.providerPrice.reduce((acc, item) => {
  //   return acc + (item.id === itemId ? item.quantity : 0);
  // }, 0);

  // TODO ordering - parse data ?
  // TODO dynamic by day/month/year
  function groupByDate(array: any) {
    return array
      .reduce((acc: {[key: string]: any}, obj: {[key: string]: any}) => {
        console.log('hash')
        console.log(acc)
        console.log('obj:')
        console.log(obj)
        if (obj['Date'] === undefined) {
          return acc
        }
        return { ...acc, [obj['Date']]:( acc[obj['Date']] || [] ).concat(obj) }
      }, {})
  }

  console.log(groupByDate(logData))

  const data2 = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];


  return (
    <Wrapper>
      <h1>sdf</h1>
        <BarChart
          width={500}
          height={300}
          data={data2}
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
          <Bar dataKey="pv" fill="#8884d8" />
          <Bar dataKey="uv" fill="#82ca9d" />
        </BarChart>
    </Wrapper>
  )
}
