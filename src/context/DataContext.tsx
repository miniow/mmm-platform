// src/context/DataContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

type DataContextType = {
  tableData: any[];
  setTableData: (data: any[]) => void;
  columns: any[];
  setColumns: (cols: any[]) => void;
};

export const DataContext = createContext<DataContextType | undefined>(undefined);

type DataProviderProps = {
  children: ReactNode;
};

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);

  return (
    <DataContext.Provider value={{ tableData, setTableData, columns, setColumns }}>
      {children}
    </DataContext.Provider>
  );
};
