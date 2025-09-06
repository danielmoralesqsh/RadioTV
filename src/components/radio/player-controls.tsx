'use client';

import Image from 'next/image';
import { Power, SkipBack, SkipForward, Volume2, Maximize2, PowerOff } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import type { Station } from '@/types/radio';

interface PlayerControlsProps {
  station: Station | null;
}

export function PlayerControls({ station }: PlayerControlsProps) {
  const [isOff, setIsOff] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    if (station && audioRef.current) {
      setIsOff(false);
      audioRef.current.src = station.url_resolved;
      audioRef.current.load();
      audioRef.current.play().catch(e => console.error("Autoplay was prevented:", e));
    }
  }, [station]);

  useEffect(() => {
    if (audioRef.current) {
      if (isOff) {
        audioRef.current.pause();
      } else {
        if (station) {
            audioRef.current.play().catch(e => console.error("Autoplay was prevented:", e));
        }
      }
    }
  }, [isOff]);
  
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  const togglePower = () => {
    // Prevent turning on if no station is selected
    if (!station) {
        setIsOff(true);
        return;
    }
    setIsOff(!isOff);
  };

  return (
    <div className="flex items-center justify-between w-full px-4 py-2 text-foreground">
      <div className="flex items-center gap-4 w-1/4">
        <Image
          src={station?.favicon || 'https://picsum.photos/id/10/64/64'}
          alt={station?.name || 'Album Art'}
          width={56}
          height={56}
          data-ai-hint="moody portrait"
          className="rounded-md object-cover"
          unoptimized
          onError={(e) => {
            e.currentTarget.src = 'https://picsum.photos/id/10/64/64';
          }}
        />
        <div>
          <p className="font-semibold text-sm truncate">{station?.name || 'No station selected'}</p>
          <p className="text-xs text-muted-foreground">{station?.tags || '...'}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 w-1/2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" disabled={!station}>
            <SkipBack className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant={isOff ? "destructive" : "default"}
            className="bg-primary hover:bg-primary/90 rounded-full h-10 w-10 text-primary-foreground"
            onClick={togglePower}
            disabled={!station}
          >
            {isOff ? <PowerOff className="w-5 h-5" /> : <Power className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" disabled={!station}>
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>
         <div className="flex items-center gap-2 w-full max-w-md text-xs text-muted-foreground">
          <audio ref={audioRef} className="hidden" />
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 w-1/4">
        <Volume2 className="w-5 h-5 text-muted-foreground" />
        <Slider defaultValue={[volume * 100]} max={100} step={1} className="w-24" onValueChange={handleVolumeChange} />
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Maximize2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
