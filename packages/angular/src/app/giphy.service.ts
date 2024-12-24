import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { catchError, delay, map, Observable, throwError } from 'rxjs';
import { match, Pattern } from 'ts-pattern';
import { rxResource } from '@angular/core/rxjs-interop';

const FixedHeightPattern = {
  images: {
    fixed_height: {
      url: Pattern.string,
    },
  },
} as const;

type GiphyResponse = {
  data: Pattern.infer<typeof FixedHeightPattern>;
};

@Injectable({
  providedIn: 'root',
})
export class GiphyService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly API_KEY: string = 'vxDDLFdCxLjyUCumrDGUiFyO7Jsr0Xcd';
  private readonly query: string = `https://api.giphy.com/v1/gifs/search?api_key=${this.API_KEY}&q=dog&limit=25&offset=0&rating=g&lang=en`;

  private readonly giphy$ = this.http.get<GiphyResponse>(this.query).pipe(
    delay(1000),
    map((res: unknown) => {
      return match(res)
        .with(
          {
            data: Pattern.array(FixedHeightPattern),
          },
          ({ data }) => data.map((v) => v.images.fixed_height.url),
        )
        .otherwise(() => {
          throw new Error('Something bad happened');
        });
    }),
    catchError(() => {
      return throwError(() => 'Something bad happened');
    }),
  );

  giphyResource = rxResource({
    loader: () => this.giphy$,
  });

  fixedHeightUrls = computed(
    () => this.giphyResource.value() ?? ([] as string[]),
  );

  get(): Observable<string[]> {
    return this.http.get(this.query).pipe(
      map((res: unknown) => {
        return match(res)
          .with(
            {
              data: Pattern.array(FixedHeightPattern),
            },
            ({ data }) => data.map((v) => v.images.fixed_height.url),
          )
          .otherwise(() => {
            throw new Error('Something bad happened');
          });
      }),
      catchError(() => {
        return throwError(() => 'Something bad happened');
      }),
    );
  }

  constructor() {}
}
