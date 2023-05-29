import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Indexes } from '../../common/constants';
import { Meetup, Sort } from './types';
import { distance } from './constants';

@Injectable()
export class MeetupIndexerService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async searchMeetups({
    searchQuery = '',
    filterTags = [],
    sortBy = 'date',
    sortOrder = 'asc' as Sort,
    size = 10,
    from = 0,
    location = null,
  } = {}): Promise<Meetup[]> {

    const body = {
      query: {
        bool: {
          must: [
            {
              // query_string - позволяет искать текст в полях документов
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
      // если filterTags.length > 0, тогда создается объект terms
      // для фильтрации по тегам
      body.query.bool.filter.push({
        terms: {
          tags: filterTags,
        },
      });
    }

    if (location) {
      // если есть location, то создается объект geo_distance
      body.query.bool.filter.push({
        geo_distance: {
          distance: distance,
          location: {
            lat: parseFloat(location.lat),
            lon: parseFloat(location.lon),
          },
        },
      });
    }

    const { hits } = await this.elasticsearchService.search({
      index: Indexes.MEETUP,
      body,
    });

    const arr = hits.hits;
    const sortedArr = arr.map((item) => {
      return item._source;
    }) as Meetup[];
    return sortedArr;
  }

  async findMeetupById(id: number): Promise<Meetup> {
    const { _source } = await this.elasticsearchService.get({
      index: Indexes.MEETUP,
      id: id.toString(),
    });
    return _source as Meetup;
  }

  async indexMeetup(meetup): Promise<void> {
    await this.elasticsearchService.index({
      index: Indexes.MEETUP,
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
          lat: parseFloat(meetup.latitude),
          lon: parseFloat(meetup.longitude),
        },
      },
    });
  }

  async updateMeetup(meetup): Promise<void> {
    await this.elasticsearchService.update({
      index: Indexes.MEETUP,
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
            lat: parseFloat(meetup.latitude),
            lon: parseFloat(meetup.longitude),
          },
        },
      },
    });
  }

  async deleteMeetup(meetupId): Promise<void> {
    await this.elasticsearchService.delete({
      index: Indexes.MEETUP,
      id: meetupId.toString(),
    });
  }
}
