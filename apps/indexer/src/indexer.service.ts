import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Indexes } from './common/constants';

@Injectable()
export class IndexerService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async ensureIndexExists(): Promise<void> {
    const indexExists = await this.checkMeetupIndexExists();
    if (!indexExists) {
      await this.createMeetupIndex();
    }
  }

  async createMeetupIndex(): Promise<void> {
    await this.elasticsearchService.indices.create({
      index: Indexes.MEETUP,
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

  private async checkMeetupIndexExists(): Promise<boolean> {
    const indexExists = await this.elasticsearchService.indices.exists({
      index: Indexes.MEETUP,
    });
    return indexExists;
  }
}
