"use client";

import React, { useState, useEffect } from "react";
import { downloadChapterForOffline, isChapterDownloaded } from "@/lib/offline/chapter-downloader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, CheckCircle2, Loader2 } from "lucide-react";

export function ChapterDownloadButton({ chapterId }: { chapterId: string }) {
  const [downloaded, setDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setDownloaded(isChapterDownloaded(chapterId));
  }, [chapterId]);

  const handleDownload = async () => {
    setDownloading(true);
    const success = await downloadChapterForOffline(chapterId, (p) => setProgress(p));
    setDownloading(false);
    if (success) setDownloaded(true);
  };

  if (downloaded) {
    return (
      <Badge variant="success" className="gap-1.5 py-1.5 px-3">
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        <span>Available Offline</span>
      </Badge>
    );
  }

  return (
    <Button
      disabled={downloading}
      onClick={handleDownload}
      variant="outline"
      size="sm"
      className="gap-2 rounded-xl text-xs"
    >
      {downloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Downloading ({progress}%)</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span>Download Chapter for Offline</span>
        </>
      )}
    </Button>
  );
}
