export const convertAPIStringToDateString = (apiString: string): string => {
  const splitDate = apiString.split("T");
  const date = splitDate[0].replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
  const time = splitDate[1].replace(/(\d{2})(\d{2})(\d{2})/, "$1:$2:$3");
  return date + " " + time;
};
