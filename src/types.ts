// src/types.ts
export interface DataPipeline {
  id: number;
  name: string;
  createdDateTime: string;
  lastModified: string;
  datasources: DataSource[];
}

export interface DataSource {
  id: number;
  type: string;
  name: string;
  configuration: Record<string, any>;
  position: {
    x: number;
    y: number;
  };
}
