export const addHoursToDate = (dateString: string, hoursToAdd: number) => {
    const date = new Date(dateString);
    date.setTime(date.getTime() + hoursToAdd * 60 * 60 * 1000);
    return date.toISOString().replace('T', ' ').substring(0, 19);
  };