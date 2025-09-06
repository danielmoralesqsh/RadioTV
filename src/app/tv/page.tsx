'use client';

import Image from 'next/image';
import { Search } from 'lucide-react';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VideoPlayer } from '@/components/tv/video-player';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { WifiOff } from 'lucide-react';

interface Channel {
  name: string;
  logo: string;
  url: string;
  category: string;
}

export default function TVPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>({
    name: 'Big Buck Bunny',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    logo: 'https://picsum.photos/id/1015/400/300',
    category: 'Animation'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        // Using a filtered list from IPTV-org for general audience channels
        const response = await fetch('https://iptv-org.github.io/iptv/channels.json');
        if (!response.ok) {
          throw new Error('Failed to fetch channels');
        }
        const data: Channel[] = await response.json();
        
        // Filter for channels with a logo and a valid stream URL, and exclude adult content
        const filteredData = data.filter(channel => 
          channel.logo && 
          (channel.url.endsWith('.m3u8') || channel.url.endsWith('.mp4')) &&
          channel.category?.toLowerCase() !== 'xxx'
        );

        setChannels(filteredData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setChannels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  const handleChannelClick = (channel: Channel) => {
    setSelectedChannel(channel);
  };

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.category.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 50); // Limit to first 50 results for performance

  return (
    <div className="h-full p-4 sm:p-6 lg:p-8 flex flex-col">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">
          TV Channels
        </h1>
        <div className="relative mt-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for channels..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="mb-8">
        <VideoPlayer src={selectedChannel?.url || ''} key={selectedChannel?.url} />
        {selectedChannel && (
          <div className="mt-4">
            <h2 className="text-2xl font-bold">{selectedChannel.name}</h2>
            <Badge variant="outline" className="border-accent text-accent mt-1">{selectedChannel.category}</Badge>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="w-full h-40" />
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
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                    height={150}
                    data-ai-hint="channel logo"
                    className="w-full h-40 object-contain bg-muted p-2"
                    unoptimized
                    onError={(e) => {
                      e.currentTarget.src = 'https://picsum.photos/400/300?grayscale';
                    }}
                  />
                </CardContent>
                <CardFooter className="flex justify-between items-center p-4">
                  <CardTitle className="text-lg font-semibold truncate">{channel.name}</CardTitle>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
