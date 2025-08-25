export interface FacebookError {
  error: {
    message: string;
    type: string;
    code: number;
    fbtrace_id: string;
  };
}

export interface FacebookResponse<T = any> {
  data?: T;
  paging?: {
    cursors?: {
      before: string;
      after: string;
    };
    next?: string;
    previous?: string;
  };
  error?: FacebookError['error'];
}

export interface PaginationOptions {
  limit?: number;
  after?: string;
  before?: string;
}

export interface DateRange {
  since: string; // YYYY-MM-DD format
  until: string; // YYYY-MM-DD format
}

export interface APIRequestOptions {
  fields?: string[];
  limit?: number;
  after?: string;
  before?: string;
  time_range?: DateRange;
}

export enum FacebookApiVersion {
  V19_0 = 'v19.0',
  V18_0 = 'v18.0'
}