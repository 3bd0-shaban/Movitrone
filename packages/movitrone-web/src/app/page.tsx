import Video from 'next-video';

export default async function Page() {
  // const response = await getVideo();
  // console.log(response);
  // const blob = await response.blob();
  // const url = URL.createObjectURL(blob);
  return (
    // <VideoCom url=f{url} />
    // <Video src={'https://fwu7y5aucmvpqd3m.pradoi.com/v/01/03571/73jfvha6t4ft_h/House.of.the.Dragon.S01E01.EgyDead.CoM.mp4?t=fK04WY8u5vEU4OG0-OazzpL-Q8FMKaMlebV0dP7KkBE&s=1721510429&e=129600&f=17859765&sp=400&i=0.0'} crossOrigin="anonymous"/>
    // <Video src={'http://localhost:5000/proxy/video/d/pbrvncqlbgeyf3tk5ypjljarm3tj74vf4mynwvpu4kmqdbf54xlojqcwzvrzvzxgx5mxayro/El.Kabeer.Awy.8.S01E27'} crossOrigin="anonymous"/>
    <video controls width='600'>
      <source
        src='http://localhost:5000/proxy/video/d/pbrvncqlbgeyf3tk5ypjljarm3tj74vf4mynwvpu4kmqdbf54xlojqcwzvrzvzxgx5mxayro/El.Kabeer.Awy.8.S01E27'
        type='video/mp4'
      />
      Your browser does not support the video tag.
    </video>
    //   <Player
    //   src="https://fwu7y5aucmvpqd3m.pradoi.com/v/01/03571/73jfvha6t4ft_h/House.of.the.Dragon.S01E01.EgyDead.CoM.mp4?t=fK04WY8u5vEU4OG0-OazzpL-Q8FMKaMlebV0dP7KkBE&s=1721510429&e=129600&f=17859765&sp=400&i=0.0"
    //   poster="https://www.mydomain.com/remote-poster.webp"
    //   blurDataURL="data:image/webp;base64,UklGRlA..."
    // />
    //   <track
    //     kind="captions"
    //     src="/get-started.vtt"
    //     srcLang="en"
    //     label="English"
    //     default
    //   />
    // </Video>
  );
}
