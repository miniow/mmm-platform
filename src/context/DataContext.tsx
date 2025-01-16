// src/context/DataContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import { GridColDef } from '@mui/x-data-grid';

interface DataContextType {
  tableData: any[];
  setTableData: (data: any[]) => void;
  columns: GridColDef[];
  setColumns: (columns: GridColDef[]) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);

  return (
    <DataContext.Provider value={{ tableData, setTableData, columns, setColumns }}>
      {children}
    </DataContext.Provider>
  );
};
