export const revalidate = 600;

export interface iSEOResponse {
  url: string;
}

export async function getVideo() {
  // try {
  //   const seoResponse = await fetch(`http://localhost:5000/api`, {
  //     cache: 'no-store',
  //     headers: {
  //       // Set either Origin or X-Requested-With header
  //       // Origin: window.location.origin,
  //       // Or you can use X-Requested-With header
  //       // 'X-Requested-With': 'XMLHttpRequest',
  //     },
  //   });
  //   const seoData = await seoResponse.json();
  //   return seoData;
  // } catch (error) {
  //   throw error;
  // }
}
