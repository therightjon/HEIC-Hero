"use client";

import { useState, type DragEvent, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void;
}

export function FileUploader({ onFilesAdded }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files && files.length > 0) {
      onFilesAdded(files);
      e.dataTransfer.clearData();
    }
  };
  
  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={cn(
        'relative w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200',
        isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
      )}
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      role="button"
      aria-label="File uploader"
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <UploadCloud className="w-12 h-12 text-muted-foreground" />
        <p className="font-semibold text-lg">Drag & drop files here</p>
        <p className="text-sm text-muted-foreground">or click to browse</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple
        accept="image/heic,.heic,image/jpeg,.jpeg,.jpg"
        onChange={(e) => e.target.files && onFilesAdded(Array.from(e.target.files))}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
