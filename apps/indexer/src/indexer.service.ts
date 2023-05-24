import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class IndexerService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async ensureIndexExists() {
    const indexExists = await this.checkIndexExists();
    if (!indexExists) {
      await this.createIndex();
    }
  }

  isValidLongitude(longitude: number) {
    return longitude >= -180 && longitude <= 180;
  }

  isValidLatitude(latitude: number) {
    return latitude >= -90 && latitude <= 90;
  }

  async createIndex() {
    await this.elasticsearchService.indices.create({
      index: 'meetup',
      body: {
        mappings: {
          properties: {
            id: { type: 'integer' },
            topic: { type: 'text' },
            description: { type: 'text' },
            time: { type: 'text' },
            date: { type: 'date', format: 'yyyy-MM-dd' },
            country: { type: 'text' },
            city: { type: 'text' },
            street: { type: 'text' },
            houseNumber: { type: 'text' },
            tags: { type: 'keyword' },
            location: { type: 'geo_point' },
          },
        },
      },
    });
  }

  async indexMeetup(meetup) {
    const latitude = parseFloat(meetup.latitude);
    const longitude = parseFloat(meetup.longitude);

    if (!this.isValidLatitude(latitude) || !this.isValidLongitude(longitude)) {
      throw new Error('Invalid latitude or longitude values');
    }

    await this.elasticsearchService.index({
      index: 'meetup',
      id: meetup.id.toString(),
      body: {
        id: meetup.id,
        topic: meetup.topic,
        description: meetup.description,
        time: meetup.time,
        date: meetup.date,
        country: meetup.country,
        city: meetup.city,
        street: meetup.street,
        houseNumber: meetup.houseNumber,
        tags: meetup.tags,
        location: {
          lat: latitude,
          lon: longitude
        },
      },
    });
  }

  async updateMeetup(meetup) {

    const latitude = parseFloat(meetup.latitude);
    const longitude = parseFloat(meetup.longitude);

    if (!this.isValidLatitude(latitude) || !this.isValidLongitude(longitude)) {
      throw new Error('Invalid latitude or longitude values');
    }

    await this.elasticsearchService.update({
      index: 'meetup',
      id: meetup.id.toString(),
      body: {
        doc: {
          topic: meetup.topic,
          description: meetup.description,
          time: meetup.time,
          date: meetup.date,
          country: meetup.country,
          city: meetup.city,
          street: meetup.street,
          houseNumber: meetup.houseNumber,
          tags: meetup.tags,
          location: {
            lat: latitude,
            lon: longitude
          },
        },
      },
    });
  }

  async deleteMeetup(meetupId) {
    await this.elasticsearchService.delete({
      index: 'meetup',
      id: meetupId.toString(),
    });
  }

  async findMeetupById(id: number) {
    const { _source } = await this.elasticsearchService.get({
      index: 'meetup',
      id: id.toString(),
    });
    return _source;
  }

  // async searchMeetups({
  //   searchQuery = '', // на поиск meetup, у которых есть это слово в теме или описании
  //   filterTags = [], // фильтрация по тегам
  //   sortBy = 'date', // сортировка по полю
  //   sortOrder = 'asc' as any, // порядок сортировки ('asc' или 'desc')
  //   size = 10, // размер страницы
  //   from = 0, // смещение для постраничного вывода
  //   location=null
  // } = {}) {
  //   const body = {
  //     query: {
  //       bool: {
  //         must: [
  //           {
  //             query_string: {
  //               query: searchQuery || '*',
  //             },
  //           },
  //         ],
  //         filter: [],
  //       },
  //     },
  //     sort: [
  //       {
  //         [sortBy]: {
  //           order: sortOrder,
  //         },
  //       },
  //     ],
  //     from,
  //     size,
  //   };
  //
  //   if (filterTags.length) {
  //     body.query.bool.filter = [
  //       {
  //         terms: {
  //           tags: filterTags,
  //         },
  //       },
  //     ];
  //   }
  //
  //   const { hits } = await this.elasticsearchService.search({
  //     index: 'meetup',
  //     body,
  //   });
  //
  //   const arr = hits.hits;
  //   const sortedArr = arr.map((item) => {
  //     return item._source;
  //   });
  //
  //   return sortedArr;
  // }

  async searchMeetups({
    searchQuery = '',
    filterTags = [],
    sortBy = 'date',
    sortOrder = 'asc' as any,
    size = 10,
    from = 0,
    location = null, // новый параметр для фильтрации по местоположению
  } = {}) {
    const body = {
      query: {
        bool: {
          must: [
            {
              query_string: {
                query: searchQuery || '*',
              },
            },
          ],
          filter: [],
        },
      },
      sort: [
        {
          [sortBy]: {
            order: sortOrder,
          },
        },
      ],
      from,
      size,
    };

    if (filterTags.length) {
      body.query.bool.filter.push({
        terms: {
          tags: filterTags,
        },
      });
    }

    if (location) {
      body.query.bool.filter.push({
        geo_distance: {
          distance: '100km',
          location: {
            lat: parseFloat(location.lat),
            lon: parseFloat(location.lon),
          },
        },
      });
    }

    const { hits } = await this.elasticsearchService.search({
      index: 'meetup',
      body,
    });

    const arr = hits.hits;
    const sortedArr = arr.map((item) => {
      return item._source;
    });

    return sortedArr;
  }

  private async checkIndexExists() {
    const indexExists = await this.elasticsearchService.indices.exists({
      index: 'meetup',
    });
    return indexExists;
  }


}
