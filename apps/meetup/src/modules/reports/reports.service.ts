import { Injectable } from '@nestjs/common';
import { MeetupService } from '../meetup/meetup.service';
import { Format } from './types';
import * as Papa from 'papaparse';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { YandexCloudService } from '@app/common';

@Injectable()
export class ReportsService {
  constructor(
    private readonly meetupService: MeetupService,
    private readonly yandexCloudService: YandexCloudService,
  ) {}

  async generateReport(format: Format): Promise<string> {
    const data = await this.meetupService.findAllMeetups();
    let buffer: Buffer;
    let contentType: string;
    let fileName: string;

    if (format.type === 'csv') {
      ({ buffer, fileName } = this.generateCsvReport(data));
      contentType = 'text/csv';
    } else {
      ({ buffer, fileName } = await this.generatePdfReport(data));
      contentType = 'application/pdf';
    }

    const link = await this.yandexCloudService.uploadFile(
      buffer,
      fileName,
      contentType,
    );

    return link;
  }

  private generateCsvReport(data: any[]): { buffer: Buffer; fileName: string } {
    const csvHeader = [
      'Topic',
      'Description',
      'Time',
      'Date',
      'Country',
      'City',
      'Street',
      'House Number',
      'Tags',
    ];

    const csvData = data.map((meetup) => [
      meetup.topic,
      meetup.description,
      meetup.time,
      meetup.date,
      meetup.country,
      meetup.city,
      meetup.street,
      meetup.houseNumber,
      meetup.tags.join(', '),
    ]);

    csvData.unshift(csvHeader);

    // преобразование данных в CSV строку
    const csv = Papa.unparse(csvData);

    const buffer = Buffer.from(csv);
    const fileName = `meetup-report-${Date.now()}.csv`;

    return { buffer, fileName };
  }

  private async generatePdfReport(
    data: any[],
  ): Promise<{ buffer: Buffer; fileName: string }> {
    const pdfDoc = await PDFDocument.create();

    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const page = pdfDoc.addPage();

    const { width, height } = page.getSize();
    const fontSize = 12;
    const margin = 40;
    const lineHeight = fontSize * 1.5;
    let yPos = height - margin;

    const text = 'Meetup report';
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const xPos = (width - textWidth) / 2;

    page.setFontSize(fontSize * 1.5);
    page.drawText(text, { x: xPos, y: yPos, font });

    yPos -= lineHeight * 2;

    data.forEach((meetup) => {
      page.drawText(`Topic: ${meetup.topic}`, {
        x: margin,
        y: yPos,
        size: fontSize,
        font,
      });
      yPos -= lineHeight;
      page.drawText(`Description: ${meetup.description}`, {
        x: margin,
        y: yPos,
        size: fontSize,
        font,
      });
      yPos -= lineHeight;
      page.drawText(`Time: ${meetup.time}`, {
        x: margin,
        y: yPos,
        size: fontSize,
        font,
      });
      yPos -= lineHeight;
      page.drawText(`Date: ${meetup.date}`, {
        x: margin,
        y: yPos,
        size: fontSize,
        font,
      });
      yPos -= lineHeight;
      page.drawText(`Country: ${meetup.country}`, {
        x: margin,
        y: yPos,
        size: fontSize,
        font,
      });
      yPos -= lineHeight;
      page.drawText(`City: ${meetup.city}`, {
        x: margin,
        y: yPos,
        size: fontSize,
        font,
      });
      yPos -= lineHeight;
      page.drawText(`Street: ${meetup.street}`, {
        x: margin,
        y: yPos,
        size: fontSize,
        font,
      });
      yPos -= lineHeight;
      page.drawText(`House Number: ${meetup.houseNumber}`, {
        x: margin,
        y: yPos,
        size: fontSize,
        font,
      });
      yPos -= lineHeight;
      page.drawText(`Tags: ${meetup.tags.join(', ')}`, {
        x: margin,
        y: yPos,
        size: fontSize,
        font,
      });
      yPos -= lineHeight * 2;
    });

    const pdfBytes = await pdfDoc.save();
    const buffer = Buffer.from(pdfBytes);

    const fileName = `meetup-report-${Date.now()}.pdf`;

    return { buffer, fileName };
  }
}
