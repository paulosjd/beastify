import { LogItem } from "./types";

export const groupByKey = <T extends Record<string, string>,>(arr: T[], key: string) => arr
  .reduce((acc: Record<string, T[]>, obj) => ({
    ...acc,
    [obj[key]]:( acc[obj[key]] || [] ).concat(obj)
  }), {});

export const countForKey = (arr: Record<string, string>[], key: string) => arr
  .reduce((acc: Record<string, number>, obj) => ({
    ...acc,
    [obj[key]]: ( acc[obj[key]] || 0 ) + 1
  }), {});

export const monthToNumber = (month: string, reverse: boolean = false): string => {
  let ind: number;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (reverse) {
    ind = parseInt(month);
    const validRange = Array.from({ length: 12 }, (v, i) => i + 1);
    return validRange.includes(ind) ? months[ind - 1] : '';
  }
  ind = months.indexOf(month);
  return ind === -1 ? '' : (ind + 1).toString().padStart(2, '0');
}

export const sortDateStrings = (arr: string[]) => {
  return arr.sort((a, b) => {
    const dateStringA = a.split('/').reverse().join('');
    const dateStringB = b.split('/').reverse().join('');
    return dateStringA > dateStringB ? 1 : dateStringA === dateStringB ? 0 : -1;
  })
};

export const getColorForIndex = (ind: number, colors?: string[]): string => {
  let colorCodes = colors || [
    '#C2DF22FF', '#c2df22', '#86d449', '#51c468', '#2ab07e', '#1e9a89', '#24858d', '#2d6f8e', '#38578c', '#423d84',
    '#482172', '#390962', '#390962', '#35264b', '#221526', '#221526', '#221526', '#221526'
  ];
  return colorCodes[ind] || '#1e9a89';
};

export const getLogitemId = (logItem: LogItem) => {
  const { route, crag, date } = logItem;
  return `${route}_${crag}_${date}`
    .toLowerCase()
    .replace(/\s/g, '_')
    .replace(/\W/g, '');
};

export const dateFromTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
};

export function linearRegression(inputArray: any, xLabel: any, yLabel: any) {
  const x = inputArray.map((element: any) => element[xLabel]);
  const y = inputArray.map((element: any) => element[yLabel]);
  const sumX = x.reduce((prev: any, curr: any) => prev + curr, 0);
  const avgX = sumX / x.length;
  const xDifferencesToAverage = x.map((value: any) => avgX - value);
  const xDifferencesToAverageSquared = xDifferencesToAverage.map(
    (value: any) => value ** 2
  );
  const SSxx = xDifferencesToAverageSquared.reduce(
    (prev: any, curr: any) => prev + curr,
    0
  );
  const sumY = y.reduce((prev: any, curr: any) => prev + curr, 0);
  const avgY = sumY / y.length;
  const yDifferencesToAverage = y.map((value: any) => avgY - value);
  const xAndYDifferencesMultiplied = xDifferencesToAverage.map(
    (curr: any, index: any) => curr * yDifferencesToAverage[index]
  );
  const SSxy = xAndYDifferencesMultiplied.reduce(
    (prev: any, curr: any) => prev + curr,
    0
  );
  const slope = SSxy / SSxx;
  const intercept = avgY - slope * avgX;
  return (x: any) => intercept + slope * x;
}

type ObjWithName = {
  name: string
};

export const sortByName = (a: ObjWithName, b: ObjWithName) => a.name < b.name ? -1 : a.name > b.name ?  1: 0;
