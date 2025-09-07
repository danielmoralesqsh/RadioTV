'use client';

import Image from 'next/image';
import { WifiOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PlayerControls } from '@/components/radio/player-controls';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Station } from '@/types/radio';

export default function RadioPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('Ecuador');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      if (!selectedCountry) return;
      try {
        setLoading(true);
        const response = await fetch(`https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(selectedCountry)}?limit=40&hidebroken=true`);
        if (!response.ok) {
          throw new Error('No se pudieron obtener las emisoras');
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
        setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido');
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
  
  return (
    <div className="h-full flex flex-col">
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">
            Emisoras de Radio
          </h1>
        </header>

        <div>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">Emisoras de Ecuador</h2>
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
          ) : stations.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {stations.map((station) => (
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
              <AlertTitle>No se encontraron emisoras</AlertTitle>
              <AlertDescription>
                No se encontraron emisoras. 
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
