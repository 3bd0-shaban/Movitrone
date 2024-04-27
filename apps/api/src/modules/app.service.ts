import { HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios'; // Assuming you want to use axios for HTTP requests

@Injectable()
export class AppService {
  getHello() {
    return {
      url: 'https://storage.googleapis.com/muxdemofiles/mux.mp4',
    };
  }

  async proxyVideo(url: string) {
    try {
      if (!url) {
        throw new Error('Video URL is missing.');
      }

      const response = await axios.get(url, { responseType: 'stream' });

      if (!response || response.status !== 200) {
        throw new Error('Failed to fetch video.');
      }

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
