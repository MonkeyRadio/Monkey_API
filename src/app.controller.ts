import { Controller, Get, HttpException, Redirect, Request, VERSION_NEUTRAL } from "@nestjs/common";
import { env } from "process";

// TODO: Remove this controller when API v3 is no longer needed

@Controller({
  version: VERSION_NEUTRAL,
})
export class AppController {
  @Get()
  async proxyToOldApi(@Request() request: any) {
    const constructUrl = (rawGetParameters: string) => `${env.API_V3_GET_PROXY}/?${rawGetParameters}`;

    try {
      const rawGetParameters = request.url.split('?')[1];
      if (!rawGetParameters)
        throw { message: 'No parameters in url', code: 400 };

      const url = constructUrl(rawGetParameters);

      const proxy = await fetch(url);

      const responseStatus = proxy.status;
      if (responseStatus !== 200)
        throw { message: 'Api returned an error', code: responseStatus };

      let response;
      const responseType = proxy.headers.get('content-type');
      if (responseType && responseType.includes('application/json'))
        response = await proxy.json();
      else
        response = await proxy.text();

      return response;
    } catch (e) {
      if (e.code)
        throw new HttpException(e.message || 'Unknown error', e.code);
      throw new HttpException('API v3 not responding...', 500);
    }
  }

  @Get('MediaPicture')
  @Redirect(`${env.API_V3_GET_PROXY}/MediaPicture`, 301)
  async proxyMediaPictureToOldApi(@Request() request: any) {
    const constructUrl = (rawGetParameters: string) => `${env.API_V3_GET_PROXY}/MediaPicture?${rawGetParameters}`;

    try {
      const rawGetParameters = request.url.split('?')[1];
      if (!rawGetParameters)
        throw { message: 'No parameters in url', code: 400 };
      const url = constructUrl(rawGetParameters);

      return { url };
    } catch (e) {
      if (e.code)
        throw new HttpException(e.message || 'Unknown error', e.code);
      throw new HttpException('API v3 not responding...', 500);
    }
  }

  @Get('MediaLyrics')
  @Redirect(`${env.API_V3_GET_PROXY}/MediaLyrics`, 301)
  async proxyMediaLyricsToOldApi(@Request() request: any) {
    const constructUrl = (rawGetParameters: string) => `${env.API_V3_GET_PROXY}/MediaLyrics?${rawGetParameters}`;

    try {
      const rawGetParameters = request.url.split('?')[1];
      if (!rawGetParameters)
        throw { message: 'No parameters in url', code: 400 };
      const url = constructUrl(rawGetParameters);

      return { url };
    } catch (e) {
      if (e.code)
        throw new HttpException(e.message || 'Unknown error', e.code);
      throw new HttpException('API v3 not responding...', 500);
    }
  }

}