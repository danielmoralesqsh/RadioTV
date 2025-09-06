import Image from 'next/image';
import { Search } from 'lucide-react';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const channels = [
  { name: 'Global News', category: 'News', image: 'https://picsum.photos/id/1015/400/300', hint: 'news broadcast' },
  { name: 'Cinema World', category: 'Movies', image: 'https://picsum.photos/id/1043/400/300', hint: 'film reel' },
  { name: 'Sports Hub', category: 'Sports', image: 'https://picsum.photos/id/107/400/300', hint: 'stadium lights' },
  { name: 'Wild Planet', category: 'Documentary', image: 'https://picsum.photos/id/237/400/300', hint: 'nature landscape' },
  { name: 'Cartoon Universe', category: 'Kids', image: 'https://picsum.photos/id/163/400/300', hint: 'animation cel' },
  { name: 'Music Now', category: 'Music', image: 'https://picsum.photos/id/145/400/300', hint: 'concert stage' },
  { name: 'Kitchen Masters', category: 'Cooking', image: 'https://picsum.photos/id/1080/400/300', hint: 'gourmet dish' },
  { name: 'Retro TV', category: 'Classic', image: 'https://picsum.photos/id/175/400/300', hint: 'vintage television' },
];

export default function TVPage() {
  return (
    <div className="h-full p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">
          TV Channels
        </h1>
        <div className="relative mt-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search for channels..." className="pl-10" />
        </div>
      </header>

      <div className="mb-8">
        <div className="aspect-video w-full rounded-lg bg-card flex items-center justify-center border-2 border-dashed border-primary/50">
          <p className="text-muted-foreground">TV Player Placeholder</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {channels.map((channel) => (
          <Card key={channel.name} className="group overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-0">
              <Image
                src={channel.image}
                alt={channel.name}
                width={400}
                height={300}
                data-ai-hint={channel.hint}
                className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4">
              <CardTitle className="text-lg font-semibold">{channel.name}</CardTitle>
              <Badge variant="outline" className="border-accent text-accent">{channel.category}</Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
