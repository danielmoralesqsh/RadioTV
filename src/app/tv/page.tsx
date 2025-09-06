'use client';

import Image from 'next/image';
import { Search, WifiOff, Tv, Globe } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VideoPlayer } from '@/components/tv/video-player';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Channel {
  name: string;
  logo: string;
  url: string;
  category: string;
}

interface Country {
  code: string;
  name: string;
}

// Function to parse M3U content
const parseM3U = (content: string): Channel[] => {
  const channels: Channel[] = [];
  const lines = content.split('\n');
  let currentChannel: Partial<Channel> = {};

  for (const line of lines) {
    if (line.startsWith('#EXTINF:')) {
      const info = line.match(/tvg-logo="([^"]*)" group-title="([^"]*)"[^,]*,(.*)/);
      if (info) {
        currentChannel = {
          logo: info[1],
          category: info[2],
          name: info[3].trim(),
        };
      }
    } else if (line.startsWith('http') && currentChannel.name) {
      currentChannel.url = line.trim();
      if (currentChannel.url && currentChannel.logo && currentChannel.category) {
        channels.push(currentChannel as Channel);
      }
      currentChannel = {};
    }
  }
  return channels;
};


export default function TVPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('ec');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://iptv-org.github.io/api/countries.json');
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data: Country[] = await response.json();
        setCountries(data);
      } catch (err) {
        // Not showing this error to the user to avoid clutter
        console.error(err);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchChannels = async () => {
      if (!selectedCountry) return;
      try {
        setLoading(true);
        setError(null);
        setChannels([]);
        setSelectedChannel(null);
        const response = await fetch(`https://iptv-org.github.io/iptv/countries/${selectedCountry}.m3u`);
        if (!response.ok) {
          throw new Error(`Failed to fetch channels for ${selectedCountry}`);
        }
        const m3uContent = await response.text();
        const parsedChannels = parseM3U(m3uContent);
        
        const filteredData = parsedChannels.filter(channel => 
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
  }, [selectedCountry]);

  const handleChannelClick = (channel: Channel) => {
    setSelectedChannel(channel);
  };

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.category.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 50); // Limit to first 50 results for performance

  const countryName = countries.find(c => c.code === selectedCountry)?.name || selectedCountry;

  return (
    <div className="h-full p-4 sm:p-6 lg:p-8 flex flex-col">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">
          TV Channels
        </h1>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="relative max-w-sm flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search for channels..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative min-w-[200px]">
             <Select onValueChange={setSelectedCountry} value={selectedCountry}>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <SelectValue placeholder="Select a country" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="mb-8">
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
            {loading ? (
              <>
                <Skeleton className="w-16 h-16" />
                <Skeleton className="h-4 w-48 mt-4" />
              </>
            ) : error ? (
              <>
                <WifiOff className="w-16 h-16 text-destructive" />
                <p className="mt-4 text-destructive-foreground">Error loading channels</p>
              </>
            ) : channels.length > 0 ? (
              <>
                <Tv className="w-12 h-12 text-muted-foreground" />
                <h3 className="text-xl font-semibold mt-4 mb-2">Select a channel to start</h3>
                <div className="flex gap-4">
                  {channels.slice(0, 3).map(channel => (
                     <Card 
                        key={`${channel.name}-quick-select`} 
                        className="group overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer w-40"
                        onClick={() => handleChannelClick(channel)}
                      >
                        <CardContent className="p-0">
                           <Image
                            src={channel.logo}
                            alt={channel.name}
                            width={160}
                            height={120}
                            data-ai-hint="channel logo"
                            className="w-full h-24 object-contain bg-background/50 p-1"
                            unoptimized
                            onError={(e) => { e.currentTarget.src = 'https://picsum.photos/160/120?grayscale'; }}
                          />
                        </CardContent>
                        <p className="text-xs font-semibold truncate p-2 text-center">{channel.name}</p>
                      </Card>
                  ))}
                </div>
              </>
            ) : (
              <Alert>
                <AlertTitle>No Channels Found</AlertTitle>
                <AlertDescription>
                  No channels found for {countryName}. Try another country.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Channels from {countryName}</h2>
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
        ) : filteredChannels.length > 0 ? (
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
                <CardContent className="p-4">
                  <CardTitle className="text-lg font-semibold truncate">{channel.name}</CardTitle>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Alert>
            <AlertTitle>No Channels Found</AlertTitle>
            <AlertDescription>
              No channels found for {countryName} that match your search.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
