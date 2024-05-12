export const urlToBlob = async (url: string) => {
  const response = await fetch(url);
  const data = await response.blob();
  const metadata = { type: 'application/octet-stream' };
  return new File([data], 'image', metadata);
};
