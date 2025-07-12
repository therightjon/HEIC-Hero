"use client";

import { CheckCircle2, Download, FileText, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ProcessedFile } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

interface FileListItemProps {
  processedFile: ProcessedFile;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export function FileListItem({ processedFile }: FileListItemProps) {
  const { file, status, optimizedUri, error } = processedFile;

  const renderStatusIconAndAction = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="flex items-center justify-end w-28 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center justify-end gap-2 w-28">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'hsl(var(--accent))' }} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" asChild className="flex-shrink-0 h-8 w-8">
                      <a href={optimizedUri} download={`${file.name.split('.')[0]}.jpeg`}>
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                      </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download JPEG</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      case 'failed':
        return (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger as="div" className="flex justify-end w-28">
                <div className="flex items-center gap-1.5 text-destructive cursor-help">
                  <XCircle className="w-5 h-5" />
                </div>
              </TooltipTrigger>
              <TooltipContent><p>{error || 'An unknown error occurred.'}</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'waiting':
      default:
        return (
           <div className="flex items-center justify-end w-28">
             <Badge variant="secondary">Queued</Badge>
           </div>
        );
    }
  };
  
  return (
    <div className="flex flex-col gap-2 p-3 border-b border-border/80 last:border-b-0 hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-4">
            <div className="p-2 bg-muted rounded-md">
                <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">{formatBytes(file.size)}</p>
            </div>
            {renderStatusIconAndAction()}
        </div>
        {status === 'processing' && <Progress value={50} className="h-1 w-full" />}
    </div>
  );
}
