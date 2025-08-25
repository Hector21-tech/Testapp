export interface AdAccount {
  id: string;
  account_id: string;
  name: string;
  account_status: number;
  currency: string;
  timezone_name: string;
  timezone_offset_hours_utc: number;
  business?: {
    id: string;
    name: string;
  };
  capabilities: string[];
}

export interface AdAccountsResponse {
  data: AdAccount[];
  paging?: {
    cursors?: {
      before: string;
      after: string;
    };
    next?: string;
    previous?: string;
  };
}