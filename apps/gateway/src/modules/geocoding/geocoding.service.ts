import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeocodingService {
  constructor(private httpService: HttpService) {}

  async getCoordinates(
    country: string = '',
    city: string = '',
    street: string = '',
    houseNumber: string = '',
  ): Promise<{ latitude: number; longitude: number }> {
    const apiKey = '1e36330f-052b-4e06-9077-e57b0342ad6d';
    const address = `${country}, ${city}, ${street}, ${houseNumber}`;

    const response: AxiosResponse = await this.httpService
      .get(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${encodeURIComponent(
          address,
        )}`,
      )
      .toPromise();
    if (response.data.response.GeoObjectCollection.featureMember.length > 0) {
      const coordinates =
        response.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
          ' ',
        );
      return {
        latitude: parseFloat(coordinates[1]),
        longitude: parseFloat(coordinates[0]),
      };
    } else {
      throw new Error('Failed to get coordinates');
    }
  }
}
