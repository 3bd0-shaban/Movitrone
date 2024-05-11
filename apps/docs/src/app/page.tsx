import { getVideo } from '@/services/getVideo';

import Video from 'next-video';

export default async function Page() {
  // const response = await getVideo();
  // console.log(response);
  // const blob = await response.blob();
  // const url = URL.createObjectURL(blob);
  return (
    // <VideoCom url=f{url} />
    <Video src={'https://storage.googleapis.com/muxdemofiles/mux.mp4'}>
      <track
        kind="captions"
        src="/get-started.vtt"
        srcLang="en"
        label="English"
        default
      />
    </Video>
  );
}
