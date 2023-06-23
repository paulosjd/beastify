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

export const getColorForIndex = (ind: number): string => {
  const colors = [
    '#C2DF22FF', '#c2df22', '#86d449', '#51c468', '#2ab07e', '#1e9a89', '#24858d', '#2d6f8e', '#38578c', '#423d84',
    '#482172', '#390962', '#390962', '#35264b', '#221526', '#221526', '#221526', '#221526'
  ];
  return colors[ind] || '#1e9a89';
};

export const getLogitemId = (logItem: LogItem) => {
  const { route, crag, date } = logItem;
  return `${route}_${crag}_${date}`
    .toLowerCase()
    .replace(/\s/g, '_')
    .replace(/\W/g, '');
};
