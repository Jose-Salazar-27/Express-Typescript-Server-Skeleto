// I should create my own promise result types cause typescript just only allow access to 'status' prop
export interface PromiseAllResult<T> {
  status: string;
  value?: T;
  reason?: any;
}

export interface CommunityMessage {
  author: string;
  content: string;
  date: string;
}
