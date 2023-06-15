export const groupByKey = <T extends Record<string, string>,>(arr: T[], key: string) => arr
  .reduce((acc: Record<string, T[]>, obj: T) => ({
    ...acc,
    [obj[key]]:( acc[obj[key]] || [] ).concat(obj)
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
    '#bbef2b', '#A4DE6C', '#32c194', '#8DD1E1', '#83A6ED', '#8884D8', '#d671ed', '#FFC658', '#F9923E',
    '#F2562B', '#F2562B', '#7c7e8e'
  ];
  let color = colors[ind];
  if (!color) {
    color = colors[Math.floor(Math.random() * colors.length)];
  }
  return color;
};