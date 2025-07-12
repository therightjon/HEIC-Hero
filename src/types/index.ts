export type FileStatus = 'waiting' | 'processing' | 'completed' | 'failed';

export type ProcessedFile = {
  id: string;
  file: File;
  status: FileStatus;
  optimizedUri?: string;
  error?: string;
};
