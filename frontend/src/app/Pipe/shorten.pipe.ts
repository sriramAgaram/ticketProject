import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
  name: 'shorten',
  standalone: true,
})
export class ShortenPipe implements PipeTransform {
  transform(value: string, limit: number = 10): string {
    if (!value) return '';
    else {
      return value.length > limit ? value.substring(0, limit) + `...` : value;
    }
  }
}
