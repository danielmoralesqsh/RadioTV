'use client';

import Image from 'next/image';
import { Power, Volume2, Maximize2, PowerOff, Loader2, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import type { Station } from '@/types/radio';
import Hls from 'hls.js';

interface PlayerControlsProps {
  station: Station | null;
}

export function PlayerControls({ station }: PlayerControlsProps) {
  const [isOff, setIsOff] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !station) return;

    setIsOff(false);
    setIsLoading(true); // Start loading when a new station is selected
    setError(null); // Clear any previous errors

    // Clear any existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const handleCanPlay = () => {
      setIsLoading(false); // Stop loading when audio can play
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };

    const handleError = () => {
      setIsLoading(false);
      setError("Radio no disponible. Selecciona otra emisora.");
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    if (station.url_resolved.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          manifestLoadingTimeOut: 10000, // 10 seconds timeout for manifest
        });
        hls.loadSource(station.url_resolved);
        hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (!isOff) {
            audio.play().catch(e => console.error("La reproducción automática fue prevenida:", e));
          }
        });
        hls.on(Hls.Events.ERROR, function (event, data) {
          if (data.fatal) {
            handleError();
          }
        });
        hlsRef.current = hls;
      } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
        audio.src = station.url_resolved;
        audio.addEventListener('loadedmetadata', () => {
          if (!isOff) {
            audio.play().catch(e => console.error("La reproducción automática fue prevenida:", e));
          }
        });
      } else {
        handleError(); // HLS not supported and native playback not possible
      }
    } else {
      audio.src = station.url_resolved;
      audio.addEventListener('loadedmetadata', () => {
        if (!isOff) {
          audio.play().catch(e => console.error("La reproducción automática fue prevenida:", e));
        }
      });
    }

    // Set a timeout for loading
    loadingTimeoutRef.current = setTimeout(() => {
      if (isLoading) {
        handleError();
      }
    }, 10000); // 10 seconds timeout for overall loading

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [station]);

  useEffect(() => {
    if (audioRef.current) {
      if (isOff) {
        audioRef.current.pause();
      } else {
        if (station) {
            audioRef.current.play().catch(e => console.error("La reproducción automática fue prevenida:", e));
        }
      }
    }
  }, [isOff, station]);
  
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
    <div className="flex flex-col sm:flex-row items-center justify-between w-full px-1 sm:px-4 py-2 text-foreground">
      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-1/4 flex-grow">
        <Image
          src={station?.favicon || 'https://picsum.photos/id/10/64/64'}
          alt={station?.name || 'Carátula del álbum'}
          width={40}
          height={40}
          data-ai-hint="moody portrait"
          className="rounded-md object-cover w-10 h-10"
          unoptimized
          onError={(e) => {
            e.currentTarget.src = 'https://picsum.photos/id/10/64/64';
          }}
        />
        <div className="flex-grow min-w-0 max-w-full">
          <p className="font-semibold text-sm truncate">{station?.name || 'No hay emisora seleccionada'}</p>
          <p className="text-xs text-muted-foreground truncate">{station?.tags || '...'}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 w-full sm:w-1/2 mt-2 sm:mt-0">
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant={isOff ? "destructive" : "default"}
            className="bg-primary hover:bg-primary/90 rounded-full h-10 w-10 text-primary-foreground"
            onClick={togglePower}
            disabled={!station}
          >
            {isLoading && !isOff ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isOff ? (
              <PowerOff className="w-5 h-5" />
            ) : (
              <Power className="w-5 h-5" />
            )}
          </Button>
        </div>
         <div className="flex items-center gap-2 w-full max-w-md text-xs text-muted-foreground">
          <audio ref={audioRef} className="hidden" />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 sm:gap-4 w-full sm:w-1/4 mt-2 sm:mt-0">
        <Volume2 className="w-5 h-5 text-muted-foreground" />
        <Slider defaultValue={[volume * 100]} max={100} step={1} className="w-16 sm:w-24" onValueChange={handleVolumeChange} />
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Maximize2 className="w-5 h-5" />
        </Button>
      </div>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm text-destructive-foreground text-sm font-semibold">
          <AlertTriangle className="w-5 h-5 mr-2" /> {error}
        </div>
      )}
    </div>
  );
}
