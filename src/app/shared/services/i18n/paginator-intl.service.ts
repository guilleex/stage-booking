import { effect, inject, Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { I18nService } from './i18n.service';

@Injectable()
export class PaginatorIntlService extends MatPaginatorIntl {
  private readonly i18n = inject(I18nService);

  constructor() {
    super();

    effect(() => {
      this.i18n.language();
      this.itemsPerPageLabel = this.i18n.translate('PAGINATOR.ITEMS_PER_PAGE');
      this.nextPageLabel = this.i18n.translate('PAGINATOR.NEXT_PAGE');
      this.previousPageLabel = this.i18n.translate('PAGINATOR.PREVIOUS_PAGE');
      this.firstPageLabel = this.i18n.translate('PAGINATOR.FIRST_PAGE');
      this.lastPageLabel = this.i18n.translate('PAGINATOR.LAST_PAGE');
      this.changes.next();
    });
  }

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return this.i18n.translate('PAGINATOR.RANGE', {
        start: '0',
        end: '0',
        length: String(length)
      });
    }

    const start = page * pageSize + 1;
    const end = Math.min(start + pageSize - 1, length);

    return this.i18n.translate('PAGINATOR.RANGE', {
      start: String(start),
      end: String(end),
      length: String(length)
    });
  };
}