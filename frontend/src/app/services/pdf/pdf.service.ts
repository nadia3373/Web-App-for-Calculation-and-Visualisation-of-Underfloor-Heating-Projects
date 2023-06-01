import { Injectable } from '@angular/core';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Project } from 'src/app/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  public async downloadReport(project: Project): Promise<void> {
    const pdfMakeModule = await import('pdfmake/build/pdfmake');
    const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
    pdfMakeModule.vfs = pdfFontsModule.pdfMake.vfs;
    const document: TDocumentDefinitions = {
      content: [
        { text: 'Отчёт', style: 'header' },
        { text: ' ' },
        {
          alignment: 'center',
          stack: [
            { image: project.image, width: 200, height: 200 },
            { text: ' ' },
            { text: 'Терморегуляторы', style: 'center' },
            { text: ' ' },
            {
              table: {
                headerRows: 1,
                widths: ['*', '*', '*'],
                body: [
                  ['Модель', 'Количество', 'Цена'],
                  [
                    project.controller.model,
                    project.combo.pipes.length,
                    project.controller.price
                  ],
                ]
              }
            },
            { text: ' ' },
            { text: 'Нагревательные элементы', style: 'center' },
            { text: ' ' },
            {
              table: {
                headerRows: 1,
                widths: ['*', '*', '*'],
                body: [
                  ['Модель', 'Количество', 'Цена'],
                  ...project.combo.pipes.map(pipe => [pipe.model, 1, pipe.price])
                ]
              }
            },
            { text: ' ' },
            { text: 'Монтажные коробки', style: 'center' },
            { text: ' ' },
            {
              table: {
                headerRows: 1,
                widths: ['*', '*', '*'],
                body: [
                  ['Модель', 'Количество', 'Цена'],
                  [project.box.model, project.combo.pipes.length, project.box.price],
                ]
              }
            }
            ,
            { text: ' ' },
            { text: 'Итого: ' + project.total },
            { text: ' ' },
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 12,
          bold: true,
          alignment: 'center',
        },
        center: {
          alignment: 'center',
        },
        subheader: {
          fontSize: 10,
          bold: true,
          alignment: 'center',
        },
      },
    };
  
    pdfMakeModule.createPdf(document, undefined, undefined, pdfFontsModule.pdfMake.vfs).download('отчет.pdf');
  }
}
