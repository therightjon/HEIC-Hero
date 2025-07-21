"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { ProcessedFile } from '@/types';
import { FileUploader } from '@/components/app/file-uploader';
import { FileList } from '@/components/app/file-list';

export default function Home() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const { toast } = useToast();

  const processFile = useCallback(async (fileId: string) => {
    const processedFile = files.find(f => f.id === fileId);
    if (!processedFile) return;

    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'processing' } : f));

    try {
      const file = processedFile.file;

      let optimizedImageDataUri: string;

      if (file.type === 'image/heic') {
        // Dynamically import heic2any here to ensure it's only loaded on the client-side
        const heic2any = (await import('heic2any')).default;
        const resultBlob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.8 });
        optimizedImageDataUri = URL.createObjectURL(resultBlob as Blob);
      } else {
        optimizedImageDataUri = URL.createObjectURL(file);
      }

      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'completed', optimizedUri: optimizedImageDataUri } : f));
    } catch (e) {
        const error = e instanceof Error ? e.message : 'An unknown conversion error occurred';
        setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'failed', error } : f));
        toast({
            title: 'File Processing Failed',
            description: `Could not process ${processedFile.file.name}: ${error}`,
            variant: 'destructive',
        });
    }
  }, [files, toast]);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    toast({
      title: 'File Removed',
      description: 'The file has been removed from the list.',
    });
  }, [toast]);

  const clearAllFiles = useCallback(() => {
    files.forEach(file => {
      if (file.optimizedUri) {
        URL.revokeObjectURL(file.optimizedUri);
      }
    });
    setFiles([]);
    toast({
      title: 'All Files Cleared',
      description: 'All files have been removed from the list.',
    });
  }, [files, toast]);

  useEffect(() => {
    files.filter(f => f.status === 'pending').forEach(f => processFile(f.id));
  }, [files, processFile]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-12 lg:p-24 bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          HEIC Hero&nbsp;
          <code className="font-mono font-bold"></code>
        </p>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 lg:w-[500px] lg:h-[200px] sm:w-[300px] sm:h-[150px] md:w-[400px] md:h-[180px] lg:before:h-[360px]">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center drop-shadow-lg leading-tight">
          HEIC Hero
        </h1>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-1 lg:text-left">
        <Card className="w-full bg-gray-800 border-gray-700 shadow-lg">
          <CardContent className="p-6">
            <FileUploader setFiles={setFiles} />
            <FileList files={files} onRemoveFile={removeFile} onClearAllFiles={clearAllFiles} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
