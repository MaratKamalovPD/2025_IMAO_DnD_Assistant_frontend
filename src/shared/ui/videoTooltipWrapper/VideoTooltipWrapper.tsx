import { useRef, ReactElement } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface VideoTooltipWrapperProps {
  children: ReactElement;
  videoSrc: string;
  width?: number;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export const VideoTooltipWrapper = ({ 
  children, 
  videoSrc, 
  width = 300, 
  placement = 'bottom' 
}: VideoTooltipWrapperProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleShow = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleHide = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Tippy
      content={
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          loop
          width={width}
          style={{ borderRadius: '8px' }}
          preload="auto"
        />
      }
      interactive
      animation="fade"      // плавная стандартная анимация
      theme="light"
      placement={placement}
      onShow={handleShow}
      onHide={handleHide}
      delay={[500, 900]}       // 800ms перед показом, 0ms перед скрытием
      duration={[450, 300]}  // 300ms анимация появления, 200ms анимация скрытия
    >
      {children}
    </Tippy>
  );
};
