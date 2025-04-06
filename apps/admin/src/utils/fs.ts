import * as fs from 'fs';

export const writeDataToFile = (filePath: string, jsonData: any): void => {
  const jsonString = JSON.stringify(jsonData, null, 2);
  fs.writeFileSync(filePath, jsonString, 'utf8');
};

export const readDataFromFile = (filePath: string): JSON | null => {
  try {
    const jsonString = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(`Error reading file from disk: ${error}`);
    return null;
  }
};
