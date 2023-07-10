export type Filter<T> = Partial<T> | { _id: any };

export type Crud<T> = {
  insert: (obj: Partial<T>) => Promise<any>;
  bulkInsert: (arr: Partial<T>[]) => Promise<T[]>;
  find: (filter: Filter<T>) => Promise<T[]>;
  findById: (id: string) => Promise<T | null>;
  update: (id: string, obj: Partial<T>) => Promise<any>;
  delete: (id: string) => Promise<any>;
};
