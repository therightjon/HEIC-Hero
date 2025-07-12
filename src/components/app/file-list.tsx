"use client";

import type { ProcessedFile } from '@/types';
import { FileListItem } from './file-list-item';
import { Separator } from '@/components/ui/separator';

interface FileListProps {
  files: ProcessedFile[];
}

export function FileList({ files }: FileListProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <Separator />
      <div className="pt-4">
        <h2 className="text-lg font-semibold px-4 mb-2">Conversion Queue</h2>
        <div className="flex flex-col">
          {files.map((processedFile) => (
            <FileListItem key={processedFile.id} processedFile={processedFile} />
          ))}
        </div>
      </div>
    </div>
  );
}
