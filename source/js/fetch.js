export default async function fetchData(targetUrl, options) {
  const response = await fetch(targetUrl, options);
  if (response.ok) {
    const fetchedData = await response.json();
    return fetchedData;
  }
  throw new Error(`${response.status} ${response.statusText}`);
}
