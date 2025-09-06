'use client';

import Image from 'next/image';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export function PlayerControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex items-center justify-between w-full px-4 py-2 text-foreground">
      <div className="flex items-center gap-4 w-1/4">
        <Image
          src="https://picsum.photos/id/10/64/64"
          alt="Album Art"
          width={56}
          height={56}
          data-ai-hint="moody portrait"
          className="rounded-md"
        />
        <div>
          <p className="font-semibold text-sm">Sunset Drive</p>
          <p className="text-xs text-muted-foreground">Indie Spirit</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 w-1/2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <SkipBack className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            className="bg-primary hover:bg-primary/90 rounded-full h-10 w-10 text-primary-foreground"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2 w-full max-w-md text-xs text-muted-foreground">
          <span>1:23</span>
          <Slider defaultValue={[40]} max={100} step={1} />
          <span>3:45</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 w-1/4">
        <Volume2 className="w-5 h-5 text-muted-foreground" />
        <Slider defaultValue={[70]} max={100} step={1} className="w-24" />
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Maximize2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
