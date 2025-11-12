import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings,
  SkipBack,
  SkipForward,
  Subtitles
} from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  captions?: {
    hindi?: string;
    tamil?: string;
    telugu?: string;
  };
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  autoPlay?: boolean;
  className?: string;
}

export function VideoPlayer({
  videoUrl,
  title,
  captions,
  onProgress,
  onComplete,
  autoPlay = false,
  className = ""
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showCaptions, setShowCaptions] = useState(false);
  const [selectedCaption, setSelectedCaption] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const progress = (video.currentTime / video.duration) * 100;
      onProgress?.(progress);

      // Mark as completed when 90% watched
      if (progress >= 90 && !isCompleted) {
        setIsCompleted(true);
        onComplete?.();
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (!isCompleted) {
        setIsCompleted(true);
        onComplete?.();
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onProgress, onComplete, isCompleted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;

    setVolume(newVolume);
    video.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!document.fullscreenElement) {
      video.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-md">
          <h3 className="text-white font-medium text-sm">{title}</h3>
        </div>
      )}

      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(true)}
      >
        {captions?.hindi && (
          <track
            kind="subtitles"
            src={captions.hindi}
            srcLang="hi"
            label="Hindi"
            default={selectedCaption === 'hindi'}
          />
        )}
        {captions?.tamil && (
          <track
            kind="subtitles"
            src={captions.tamil}
            srcLang="ta"
            label="Tamil"
            default={selectedCaption === 'tamil'}
          />
        )}
        {captions?.telugu && (
          <track
            kind="subtitles"
            src={captions.telugu}
            srcLang="te"
            label="Telugu"
            default={selectedCaption === 'telugu'}
          />
        )}
      </video>

      {/* Play/Pause Overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
        onClick={togglePlay}
        whileTap={{ scale: 0.95 }}
      >
        {!isPlaying && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="bg-white/20 backdrop-blur-sm rounded-full p-4"
          >
            <Play className="w-12 h-12 text-white fill-white" />
          </motion.div>
        )}
      </motion.div>

      {/* Controls */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <div
            className="w-full h-2 bg-white/20 rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => skip(-10)}
              className="text-white hover:bg-white/20"
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => skip(10)}
              className="text-white hover:bg-white/20"
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="text-white text-sm ml-4">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {captions && Object.keys(captions).length > 0 && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCaptions(!showCaptions)}
                  className="text-white hover:bg-white/20"
                >
                  <Subtitles className="w-4 h-4" />
                </Button>
                
                {showCaptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-sm rounded-md p-2 min-w-24"
                  >
                    <button
                      onClick={() => setSelectedCaption('')}
                      className="block w-full text-left text-white text-sm py-1 px-2 hover:bg-white/20 rounded"
                    >
                      Off
                    </button>
                    {captions.hindi && (
                      <button
                        onClick={() => setSelectedCaption('hindi')}
                        className="block w-full text-left text-white text-sm py-1 px-2 hover:bg-white/20 rounded"
                      >
                        Hindi
                      </button>
                    )}
                    {captions.tamil && (
                      <button
                        onClick={() => setSelectedCaption('tamil')}
                        className="block w-full text-left text-white text-sm py-1 px-2 hover:bg-white/20 rounded"
                      >
                        Tamil
                      </button>
                    )}
                    {captions.telugu && (
                      <button
                        onClick={() => setSelectedCaption('telugu')}
                        className="block w-full text-left text-white text-sm py-1 px-2 hover:bg-white/20 rounded"
                      >
                        Telugu
                      </button>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Completion Badge */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium"
        >
          ✓ Completed
        </motion.div>
      )}
    </div>
  );
}