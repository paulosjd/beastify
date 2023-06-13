export const groupByKey = <T extends Record<string, string>,>(arr: T[], key: string) => arr
  .reduce((acc: Record<string, T[]>, obj: T) => ({
    ...acc,
    [obj[key]]:( acc[obj[key]] || [] ).concat(obj)
  }), {});

const testArray = ["01/May/23", "01/Apr/23", "16/Nov/23", "01/Nov/23", "01/Apr/22", "01/Aug/19", "01/Jan/20", "16/Jan/20"]



export const monthToNumber = (month: string, reverse: boolean = false): string => {
  let ind: number;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (reverse) {
    ind = parseInt(month)
    const validRange = Array.from({ length: 12 }, (v, i) => i + 1);
    return validRange.includes(ind) ? months[ind - 1] : ''
  }
  ind = months.indexOf(month);
  return ind === -1 ? '' : ind.toString().padStart(2, '0');
}

interface Item {
  [key: string]: string;
  date: string;
}

// export const sortDateString = (arr: [string, Item[]]) => {
//   return arr.sort((a, b) => {
//     const dateStringA = a.split('/').reverse().join('');
//     const dateStringB = b.split('/').reverse().join('');
//     return dateStringA > dateStringB ? 1 : dateStringA === dateStringB ? 0 : -1
//   })
// };