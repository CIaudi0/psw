export interface HttpState {
  status: 'loading' | 'success' | 'empty' | 'error';
  message?: string;
}
