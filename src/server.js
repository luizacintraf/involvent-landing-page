export const getSpreadsheetData = (sheetName) => {
  const data = gasClient.serverFunctions.getSpreadsheetData(sheetName);
  return data;
};