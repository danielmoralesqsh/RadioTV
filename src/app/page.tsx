import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Tv, Radio as RadioIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl font-headline">
          Welcome to StreamVerse
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Your universe of TV and Radio. Choose your stream.
        </p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        <Link href="/tv" className="group">
          <Card className="relative overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
            <Image
              src="https://picsum.photos/800/600?grayscale"
              alt="TV"
              width={800}
              height={600}
              data-ai-hint="television screen"
              className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <Tv className="w-16 h-16 mb-4 text-primary transition-transform duration-300 group-hover:-translate-y-2" />
              <h2 className="text-3xl font-bold font-headline">Watch TV</h2>
              <p className="mt-2 text-muted-foreground">Live channels and shows</p>
            </div>
          </Card>
        </Link>
        <Link href="/radio" className="group">
          <Card className="relative overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
            <Image
              src="https://picsum.photos/800/600?blur=2"
              alt="Radio"
              width={800}
              height={600}
              data-ai-hint="radio waves"
              className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <RadioIcon className="w-16 h-16 mb-4 text-accent transition-transform duration-300 group-hover:-translate-y-2" />
              <h2 className="text-3xl font-bold font-headline">Listen to Radio</h2>
              <p className="mt-2 text-muted-foreground">Stations from around the world</p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
