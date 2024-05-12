export const getCurrentDay = () => {
  let start: Date;
  let end: Date;
  start = new Date();
  start.setHours(0, 0, 0, 0);
  // End of today
  end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};
export const getCurrentWeek = () => {
  let start: Date;
  let end: Date;
  start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  // End of current month
  end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  end.setDate(0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};
export const getCurrentMonth = () => {
  let start: Date;
  let end: Date;
  start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  // End of current month
  end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  end.setDate(0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};


export const getCurrentYear = () => {
  let start: Date;
  let end: Date;
  start = new Date();
  start.setMonth(0); // January
  start.setDate(1); // First day of January
  start.setHours(0, 0, 0, 0);

  end = new Date();
  end.setMonth(11); // December
  end.setDate(31); // Last day of December
  end.setHours(23, 59, 59, 999);

  return { start, end };
};