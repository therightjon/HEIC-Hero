"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { ProcessedFile } from '@/types';
import { FileUploader } from '@/components/app/file-uploader';
import { FileList } from '@/components/app/file-list';

// This is a mock function to simulate file conversion.
// In a real app, you would implement actual HEIC-to-JPEG conversion logic here.
const convertToJpegMock = async (imageDataUri: string): Promise<{ optimizedImageDataUri: string }> => {
  return new Promise(resolve => {
    // Simulate network delay and processing time of a conversion.
    setTimeout(() => {
      // For this mock, we just return the original data URI.
      // A real implementation would return a new data URI for the converted JPEG.
      resolve({ optimizedImageDataUri: imageDataUri });
    }, 1500);
  });
};

export default function Home() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);

  const { toast } = useToast();

  const processFile = useCallback(async (fileId: string) => {
    const processedFile = files.find(f => f.id === fileId);
    if (!processedFile) return;

    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'processing' } : f));

    try {
      const reader = new FileReader();
      reader.readAsDataURL(processedFile.file);

      reader.onload = async (event) => {
        try {
          const imageDataUri = event.target?.result as string;
          console.log(`Starting conversion for file: ${processedFile.file.name}, size: ${processedFile.file.size} bytes, type: ${processedFile.file.type}`);

          if (!imageDataUri) {
            throw new Error("Could not read file.");
          }

          // Simulate conversion instead of calling the AI.
          console.log('Simulating conversion process...');

          const result = await convertToJpegMock(imageDataUri);

          setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'completed', optimizedUri: result.optimizedImageDataUri } : f));
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

      console.log(`Reading file: ${processedFile.file.name}`);

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

  async function convertAndDownload(file: File) {
    console.log(`Attempting to convert and download file: ${file.name}`);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const image = new Image();
      image.onload = () => {
        console.log(`Image loaded. Dimensions: ${image.width}x${image.height}`);
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(image, 0, 0);
          console.log('Drawing image onto canvas.');
          canvas.toBlob(
            (blob) => {
              if (blob) {
                console.log(`JPEG blob created successfully. Size: ${blob.size} bytes, type: ${blob.type}`);
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(blob);
                const downloadFileName = file.name.replace(/.[^.]+$/, '.jpeg');
                downloadLink.download = downloadFileName;
                console.log(`Attempting to download file as: ${downloadFileName}`);
                downloadLink.click();
                URL.revokeObjectURL(downloadLink.href);
                console.log('Download link clicked and object URL revoked.');
              } else {
                console.error('Error creating JPEG blob: Blob is null.');
              }
            },
            'image/jpeg',
            0.9
          );
        } else {
          console.error('Error getting canvas context.');
        }
      };
      image.onerror = (error) => {
        console.error('Error loading image onto canvas:', error);
      };
      console.log('Reading image data URI...');
      image.src = event.target?.result as string;
    };
    reader.onerror = (error) => {
      console.error('Error reading file during download process:', error);
    };
    reader.readAsDataURL(file);
  }

  // This part of the code is now outside the Home component's scope
  // and is not directly related to the state management of the file list.
  // If you intend to use this function, you'll need to call it from
  // within the Home component's logic, likely when a file status
  // changes to 'completed' and the download is triggered.
