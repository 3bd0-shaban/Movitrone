export const getError = (error: any) => {
  if (error.response?.data?.message) {
    return error.response?.data?.message;
  } else {
    return 'Internal server error';
  }
};
