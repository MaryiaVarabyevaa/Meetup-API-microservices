import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class IndexerService {
    constructor(private readonly elasticsearchService: ElasticsearchService) {}


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
                        place: { type: 'text' },
                        tags: { type: 'keyword' },
                    },
                },
            },
        });
    }


    async indexMeetup(meetup) {
        await this.elasticsearchService.index({
            index: 'meetup',
            id: meetup.id.toString(),
            body: {
                id: meetup.id,
                topic: meetup.topic,
                description: meetup.description,
                time: meetup.time,
                date: meetup.date,
                place: meetup.place,
                tags: meetup.tags.map((tagOnMeetup) => tagOnMeetup.tag.name),
            },
        });
    }
}
