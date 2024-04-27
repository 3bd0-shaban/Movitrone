'use client';
import { Media, Video } from '@vidstack/player-react';

export default function VideoCom({ url }: { url: string }) {
  return (
    <Media>
      <Video
        loading="visible"
        poster="https://media-files.vidstack.io/poster.png"
        controls
        preload="true"
      >
        <video
          loading="visible"
          poster="https://media-files.vidstack.io/poster-seo.png"
          src={url}
          preload="none"
          data-video="0"
          controls
        />
      </Video>
    </Media>
  );
}
