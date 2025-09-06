import Image from 'next/image';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlayerControls } from '@/components/radio/player-controls';

const stations = [
  { name: 'Chillwave FM', genre: 'Electronic', image: 'https://picsum.photos/id/3/400/400', hint: 'abstract gradient' },
  { name: 'Indie Spirit', genre: 'Alternative', image: 'https://picsum.photos/id/10/400/400', hint: 'moody portrait' },
  { name: 'Jazz Classics', genre: 'Jazz', image: 'https://picsum.photos/id/103/400/400', hint: 'saxophone player' },
  { name: 'Rock On', genre: 'Rock', image: 'https://picsum.photos/id/119/400/400', hint: 'electric guitar' },
  { name: 'Hip-Hop Central', genre: 'Hip-Hop', image: 'https://picsum.photos/id/146/400/400', hint: 'city skyline' },
  { name: 'Classical Moods', genre: 'Classical', image: 'https://picsum.photos/id/169/400/400', hint: 'violin instrument' },
  { name: 'Global Beats', genre: 'World', image: 'https://picsum.photos/id/200/400/400', hint: 'colorful market' },
  { name: '80s Rewind', genre: 'Pop', image: 'https://picsum.photos/id/319/400/400', hint: 'neon lights' },
];

export default function RadioPage() {
  return (
    <div className="h-full flex flex-col">
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">
            Radio Stations
          </h1>
          <div className="relative mt-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search for stations or genres..." className="pl-10" />
          </div>
        </header>

        <div>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">Featured Stations</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {stations.map((station) => (
              <Card key={station.name} className="group overflow-hidden text-center transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                <CardContent className="p-4">
                  <div className="relative w-full aspect-square">
                    <Image
                      src={station.image}
                      alt={station.name}
                      width={400}
                      height={400}
                      data-ai-hint={station.hint}
                      className="w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-md" />
                  </div>
                  <p className="mt-2 font-semibold text-card-foreground">{station.name}</p>
                  <p className="text-sm text-muted-foreground">{station.genre}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur-sm">
        <PlayerControls />
      </footer>
    </div>
  );
}
