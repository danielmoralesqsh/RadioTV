'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { VideoPlayer } from '@/components/tv/video-player';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ChannelVideoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const channelUrl = searchParams.get('url');
  const channelName = searchParams.get('name');

  if (!channelUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-xl text-muted-foreground">No se encontró la URL del canal.</p>
        <Button onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Canales de TV
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 sm:p-6 lg:p-8">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Canales de TV
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-4">{channelName || 'Canal de TV'}</h1>
      <div className="flex-1 flex items-center justify-center">
        <VideoPlayer src={channelUrl} />
      </div>
    </div>
  );
}
