export interface DatabaseResponse {
  data: { path: string } | null;
  error: Error | null;
}

export interface StoreResponse {
  data: Blob | null;
  error: null | Error;
}

export interface PublicUrlResponse {
  data: { publicUrl: string };
}
