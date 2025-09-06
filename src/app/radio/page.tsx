'use client';

import Image from 'next/image';
import { Search, WifiOff, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlayerControls } from '@/components/radio/player-controls';
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
import type { Station } from '@/types/radio';

interface Country {
  name: string;
  iso_3166_1: string;
  stationcount: number;
}

export default function RadioPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('Ecuador');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://de1.api.radio-browser.info/json/countries?hidebroken=true&order=stationcount&reverse=true');
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
    const fetchStations = async () => {
      if (!selectedCountry) return;
      try {
        setLoading(true);
        const response = await fetch(`https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(selectedCountry)}?limit=40&hidebroken=true`);
        if (!response.ok) {
          throw new Error('Failed to fetch stations');
        }
        const data: Station[] = await response.json();
        const stationsWithImages = data
          .filter(station => station.url_resolved) // Filter out stations without a valid stream URL
          .map(station => ({
            ...station,
            favicon: station.favicon || `https://picsum.photos/seed/${station.stationuuid}/400`
          }));
        setStations(stationsWithImages);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setStations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [selectedCountry]);

  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
  };
  
  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (station.tags && station.tags.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col">
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">
            Radio Stations
          </h1>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="relative max-w-sm flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search for stations or genres..." 
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
                    <SelectItem key={country.iso_3166_1} value={country.name}>
                      {country.name} ({country.stationcount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        <div>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">Featured Stations from {selectedCountry}</h2>
          {loading ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="w-full aspect-square" />
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
          ) : filteredStations.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredStations.map((station) => (
                <Card 
                  key={station.stationuuid} 
                  className="group overflow-hidden text-center transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                  onClick={() => handleStationClick(station)}
                >
                  <CardContent className="p-4">
                    <div className="relative w-full aspect-square">
                      <Image
                        src={station.favicon}
                        alt={station.name}
                        width={400}
                        height={400}
                        data-ai-hint={station.tags}
                        className="w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-110"
                        unoptimized
                        onError={(e) => {
                          e.currentTarget.src = `https://picsum.photos/seed/${station.stationuuid}/400`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-md" />
                    </div>
                    <p className="mt-2 font-semibold text-card-foreground truncate">{station.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{station.tags}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
             <Alert>
              <AlertTitle>No Stations Found</AlertTitle>
              <AlertDescription>
                No stations found for {selectedCountry} that match your search. Try another country or a different search term.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </main>

      <footer className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur-sm">
        <PlayerControls station={selectedStation} />
      </footer>
    </div>
  );
}
