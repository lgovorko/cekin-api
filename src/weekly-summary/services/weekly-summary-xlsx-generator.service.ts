import { Injectable } from '@nestjs/common';
import { times } from 'lodash';

@Injectable()
export class WeeklySummaryXlsxGeneratorService {
  private colors = {
    white: 'FFFFFF',
    black: '000000',
    darkBlue: '333f4f',
    grayishBlue: 'adb9ca',
    lightGrayishBlue: 'd6dce4',
  };

  public async createTable(
    workSheet,
    headersValues: string[],
    rowValues: any[],
    options?: any,
  ) {
    this.createHeader(workSheet, headersValues, options);
    this.addRow(workSheet, rowValues, options);
    this.createFooter(workSheet, rowValues.length, options);
  }

  private async createHeader(
    workSheet: any,
    headersValues: string[],
    options: any,
  ) {
    return headersValues.map((currentValue, index) => {
      const coll = options.startRow + index;

      const style = {
        fill: {
          type: 'pattern',
          patternType: 'solid',
          bgColor: `${this.colors.grayishBlue}`,
          fgColor: `${this.colors.grayishBlue}`,
        },
        font: {
          color: `${this.colors.white}`,
        },
      };

      const lightGrayishBlue = [7, 8, 9, 11, 12, 15, 16, 17, 18];

      if (lightGrayishBlue.includes(coll)) {
        style.fill.bgColor = this.colors.lightGrayishBlue;
        style.fill.fgColor = this.colors.lightGrayishBlue;
      }

      if (coll === 2) {
        style.fill.bgColor = this.colors.darkBlue;
        style.fill.fgColor = this.colors.darkBlue;
      }

      return workSheet
        .cell(options.startRow, coll)
        .string(`${currentValue}`)
        .style(style);
    });
  }

  private async addRow(workSheet, rowValues: any[], options: any) {
    return rowValues.map((currentValue, index) => {
      const row = options.startRow + index + 1;

      return Object.entries(currentValue).map(
        async (currentProperty, indexProperty) => {
          const coll = options.startColl + indexProperty;
          const [, summaryValue] = currentProperty;

          const cell = workSheet.cell(row, coll);

          const style = {
            fill: {
              type: 'pattern',
              patternType: 'solid',
              bgColor: `${this.colors.lightGrayishBlue}`,
              fgColor: `${this.colors.lightGrayishBlue}`,
            },
            font: {
              color: `${this.colors.black}`,
              italics: true,
            },
          };

          const white = [7, 8, 9, 11, 12, 15, 16, 17, 18];

          if (white.includes(coll)) {
            style.fill.fgColor = this.colors.white;
            style.fill.bgColor = this.colors.white;
          }

          if (coll === 2) {
            style.fill.bgColor = this.colors.darkBlue;
            style.fill.fgColor = this.colors.darkBlue;
            style.font.color = this.colors.white;
          }

          const numberStyle = {
            ...style,
            numberFormat: '#,##0',
          };

          if (typeof summaryValue === 'number')
            cell.number(summaryValue).style(numberStyle);
          if (typeof summaryValue === 'string')
            cell.string(summaryValue).style(style);

          return cell;
        },
      );
    });
  }

  private async createFooter(workSheet: any, rowsCount: number, options: any) {
    const { startRow, startColl } = options;

    const footerRow = startRow + rowsCount;
    const endRow = startRow + rowsCount;
    const incStartRow = startRow + 1;

    return times(19, index => {
      const footerColl = startColl + index;
      const cell = workSheet.cell(footerRow + 1, footerColl);

      const footerStyle = {
        fill: {
          type: 'pattern',
          patternType: 'solid',
          bgColor: `${this.colors.grayishBlue}`,
          fgColor: `${this.colors.grayishBlue}`,
        },
      };

      switch (footerColl) {
        case 2:
          cell.string('Totals').style({
            fill: {
              type: 'pattern',
              patternType: 'solid',
              bgColor: `${this.colors.darkBlue}`,
              fgColor: `${this.colors.darkBlue}`,
            },
            font: {
              color: `${this.colors.white}`,
            },
          });
          break;
        case 3:
          cell.formula(`SUM(C${incStartRow}:C${endRow})`).style(footerStyle);
          break;
        case 4:
          cell.formula(`SUM(D${incStartRow}:D${endRow})`).style(footerStyle);
          break;
        case 5:
          cell.formula(`SUM(E${incStartRow}:E${endRow})`).style(footerStyle);
          break;
        case 6:
          cell.formula(`SUM(F${incStartRow}:F${endRow})`).style(footerStyle);
          break;
        case 7:
          cell.formula(`SUM(G${incStartRow}:G${endRow})`).style(footerStyle);
          break;
        case 8:
          cell.formula(`SUM(H${incStartRow}:H${endRow})`).style(footerStyle);
          break;
        case 9:
          cell.formula(`SUM(I${incStartRow}:I${endRow})`).style(footerStyle);
          break;
        case 10:
          cell.string('').style(footerStyle);
          break;
        case 11:
          cell.string('').style(footerStyle);
          break;
        case 12:
          cell.string('').style(footerStyle);
          break;
        case 13:
          cell.string('').style(footerStyle);
          break;
        case 14:
          cell.string('').style(footerStyle);
          break;
        case 15:
          cell.string('').style(footerStyle);
          break;
        case 16:
          cell.string('').style(footerStyle);
          break;
        case 17:
          cell.string('').style(footerStyle);
          break;
        case 18:
          cell.string('').style(footerStyle);
          break;
        case 19:
          cell.string('').style(footerStyle);
          break;
        case 20:
          cell.string('').style(footerStyle);
          break;
      }
      return cell;
    });
  }
}
