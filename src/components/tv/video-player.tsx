'use client';

import { useState, useRef, useEffect } from 'react';
import { Power, PowerOff, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface VideoPlayerProps {
  src: string;
}

export function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isOff, setIsOff] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePower = () => {
    setIsOff(!isOff);
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0] / 100;
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  const toggleFullScreen = () => {
    if (!playerRef.current) return;

    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const handleMouseLeave = () => {
    if (!isOff) {
        setShowControls(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isOff) {
      video.pause();
    } else {
      video.play().catch(e => console.error("Autoplay was prevented:", e));
    }
  }, [isOff]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };
    const onLoadedMetadata = () => {
      setDuration(video.duration);
      if (!isOff) {
          video.play().catch(e => console.error("Autoplay was prevented:", e));
      }
    };
    const onVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    const onFullScreenChange = () => setIsFullScreen(!!document.fullscreenElement);

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('volumechange', onVolumeChange);
    document.addEventListener('fullscreenchange', onFullScreenChange);
    
    video.volume = volume;

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('volumechange', onVolumeChange);
      document.removeEventListener('fullscreenchange', onFullScreenChange);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isOff]);

  return (
    <div
      ref={playerRef}
      className="relative aspect-video w-full group overflow-hidden rounded-lg bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        className={`w-full h-full object-contain ${isOff ? 'invisible' : ''}`}
        onDoubleClick={toggleFullScreen}
        loop
      />
      {isOff && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white">
           <PowerOff className="w-16 h-16 text-muted-foreground" />
           <p className="mt-4 text-muted-foreground">TV is Off</p>
        </div>
      )}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls || isOff ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">{formatTime(currentTime)}</span>
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              className="w-full"
              disabled
            />
            <span className="text-sm font-medium">{formatTime(duration)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={togglePower} variant={isOff ? "destructive" : "ghost"} size="icon" className="text-white hover:text-white hover:bg-white/20">
                {isOff ? <PowerOff className="w-6 h-6" /> : <Power className="w-6 h-6" />}
              </Button>
              <div className="flex items-center gap-2 group/volume">
                 <Button onClick={toggleMute} variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20" disabled={isOff}>
                    {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                 </Button>
                 <Slider
                   value={[isMuted ? 0 : volume * 100]}
                   onValueChange={handleVolumeChange}
                   max={100}
                   step={1}
                   className="w-24 transition-all duration-300 opacity-0 group-hover/volume:opacity-100"
                   disabled={isOff}
                 />
              </div>
            </div>
            <div>
              <Button onClick={toggleFullScreen} variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20">
                {isFullScreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
