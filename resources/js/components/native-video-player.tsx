import { useRef, useEffect } from 'react';

interface NativeVideoPlayerProps {
  src: string;
  onLoad?: () => void;
}

export default function NativeVideoPlayer({ src, onLoad }: NativeVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clean up old video
    if (videoElementRef.current) {
      const oldVideo = videoElementRef.current;
      oldVideo.pause();
      oldVideo.src = '';
      oldVideo.load();
      if (oldVideo.parentNode) {
        oldVideo.parentNode.removeChild(oldVideo);
      }
      videoElementRef.current = null;
    }

    // Create fresh video element
    const video = document.createElement('video');
    videoElementRef.current = video;

    // Set attributes
    video.setAttribute('loop', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('controls', '');
    video.setAttribute('preload', 'metadata');
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.display = 'block';
    video.style.backgroundColor = '#000';
    video.style.objectFit = 'contain';

    // Set source DIRECTLY (this is key!)
    video.src = src;

    // Append to container FIRST, then load
    container.appendChild(video);

    // Then load
    video.load();
    
    const handleCanPlay = () => {
      video.play().catch(err => {
        console.warn('Autoplay prevented:', err);
      });
      onLoad?.();
    };

    const handleLoadedMetadata = () => {
      console.log('Video metadata loaded, duration:', video.duration);
    };

    video.addEventListener('canplay', handleCanPlay, { once: true });
    video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });

    // Cleanup
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.pause();
      video.src = '';
      video.load();
      if (video.parentNode) {
        video.parentNode.removeChild(video);
      }
      videoElementRef.current = null;
    };
  }, [src, onLoad]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        backgroundColor: '#18181b',
        isolation: 'isolate',
        position: 'relative'
      }} 
    />
  );
}