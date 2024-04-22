interface DateRange {
  startDate: string;
  endDate: string;
}

export function isValidDate(dateString: string, dateRange: DateRange): boolean {
  // console.log(dateString);
  // console.log(dateRange);
  const date = new Date(dateString);
  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);

  // Check if the date is a valid date and falls within the specified range
  return !isNaN(date.getTime()) && date >= startDate && date <= endDate;
}
