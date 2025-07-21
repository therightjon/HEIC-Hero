"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { ProcessedFile } from '@/types';
import { FileUploader } from '@/components/app/file-uploader';
import { FileList } from '@/components/app/file-list';
import heic2jpeg from 'heic2jpeg';

export default function Home() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const { toast } = useToast();

  const processFile = useCallback(async (fileId: string) => {
    const processedFile = files.find(f => f.id === fileId);
    if (!processedFile) return;

    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'processing' } : f));

    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(processedFile.file);
      
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          if (!arrayBuffer) {
            throw new Error("Could not read file.");
          }

          let optimizedImageDataUri: string;

          if (processedFile.file.type === 'image/heic') {
            const jpegBlob = await heic2jpeg({ heic: arrayBuffer, quality: 0.8 }); // Adjust quality as needed
            optimizedImageDataUri = URL.createObjectURL(jpegBlob);
          } else {
            // For non-HEIC images, we can just use the original data URI or convert it if needed
            const blob = new Blob([arrayBuffer], { type: processedFile.file.type });
            optimizedImageDataUri = URL.createObjectURL(blob);
          }

          setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'completed', optimizedUri: optimizedImageDataUri } : f));
        } catch (e) {
            const error = e instanceof Error ? e.message : 'An unknown conversion error occurred';
            setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'failed', error } : f));
            toast({
              variant: 'destructive',
              title: 'Conversion Failed',
              description: `Could not process ${processedFile.file.name}. ${error}`,
            });
        }
      };
      
      reader.onerror = () => {
        throw new Error("Failed to read file data.");
      };
    } catch (e) {
      const error = e instanceof Error ? e.message : 'An unknown error occurred';
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'failed', error } : f));
      toast({
        variant: 'destructive',
        title: 'File Read Error',
        description: `Could not read ${processedFile.file.name}. ${error}`,
      });
    }
  }, [files, toast]);

  useEffect(() => {
    const fileToProcess = files.find(f => f.status === 'waiting');
    if (fileToProcess) {
      processFile(fileToProcess.id);
    }
  }, [files, processFile]);

  const handleFilesAdded = (addedFiles: File[]) => {
    const newProcessedFiles: ProcessedFile[] = addedFiles.map(file => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      status: 'waiting',
    }));
    setFiles(prev => [...prev, ...newProcessedFiles]);
  };

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight font-headline">HEIC Hero</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Effortlessly convert HEIC to JPEG.
          </p>
        </div>
        <Card className="shadow-lg">
          <CardContent className="p-2 sm:p-4">
            <FileUploader onFilesAdded={handleFilesAdded} />
            <FileList files={files} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}