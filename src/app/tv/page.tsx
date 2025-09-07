'use client';

import Image from 'next/image';
import { Search, WifiOff, Tv } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VideoPlayer } from '@/components/tv/video-player';
import { useState, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface Channel {
  name: string;
  logo: string;
  url: string;
  category: string;
}

const featuredChannels: Channel[] = [
  {
    name: "RTVE Internacional",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/RTVE_logo.svg/300px-RTVE_logo.svg.png",
    url: "https://rtvelivestream.rtve.es/rtvesec/int/tvei_ame_main.m3u8",
    category: "Noticias",
  },
  {
    name: "TeleSUR",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/TeleSUR_logo.svg/300px-TeleSUR_logo.svg.png",
    url: "https://mblesmain01.telesur.ultrabase.net/mbliveMain/hd/playlist.m3u8",
    category: "Deportes",
  },
  {
    name: "Telefe",
    logo: "https://logowik.com/content/uploads/images/telefe-new-logo-2021-9700.jpg",
    url: "https://is-tucuman.cdn.rcs.net.ar/mnp/telefe_hls/playlist.m3u8",
    category: "Entretenimiento",
  },
];

export default function TVPage() {
  const [channels, setChannels] = useState<Channel[]>(featuredChannels);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(featuredChannels[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const videoPlayerRef = useRef<HTMLDivElement>(null);

  const handleChannelClick = (channel: Channel) => {
    setSelectedChannel(channel);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full p-4 sm:p-6 lg:p-8 flex flex-col">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">
          Canales de TV
        </h1>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="relative max-w-sm flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Buscar canales..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        <div className="lg:col-span-2 lg:order-last flex justify-center" ref={videoPlayerRef}>
          {selectedChannel ? (
            <div>
              <VideoPlayer src={selectedChannel.url} key={selectedChannel.url} />
              <div className="mt-4">
                <h2 className="text-2xl font-bold">{selectedChannel.name}</h2>
                <Badge variant="outline" className="border-accent text-accent mt-1">{selectedChannel.category}</Badge>
              </div>
            </div>
          ) : (
            <div className="aspect-video w-full rounded-lg bg-muted flex flex-col items-center justify-center p-4">
              <Tv className="w-12 h-12 text-muted-foreground" />
              <h3 className="text-xl font-semibold mt-4 mb-2">Selecciona un canal para empezar</h3>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 flex-1">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">Canales destacados</h2>
          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="w-full h-24" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
             <Alert variant="destructive">
                <WifiOff className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
          ) : filteredChannels.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredChannels.map((channel) => (
                <Card 
                  key={`${channel.name}-${channel.url}`} 
                  className="group overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                  onClick={() => handleChannelClick(channel)}
                >
                  <CardContent className="p-0">
                    <Image
                      src={channel.logo}
                      alt={channel.name}
                      width={200}
                      height={112}
                      data-ai-hint="channel logo"
                      className="w-full h-28 object-contain bg-muted p-2"
                      unoptimized
                      onError={(e) => {
                        e.currentTarget.src = 'https://picsum.photos/200/112?grayscale';
                      }}
                    />
                  </CardContent>
                  <CardContent className="p-3">
                    <CardTitle className="text-base font-semibold truncate">{channel.name}</CardTitle>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertTitle>No se encontraron canales</AlertTitle>
              <AlertDescription>
                No se encontraron canales que coincidan con tu búsqueda.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}