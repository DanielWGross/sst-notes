import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, tap, throwError } from 'rxjs';
import { isMatching, match, Pattern } from 'ts-pattern';

const FixedHeightPattern = {
  images: {
    fixed_height: {
      url: Pattern.string,
    },
  },
} as const;

@Injectable({
  providedIn: 'root',
})
export class GiphyService {
  private readonly http = inject(HttpClient);
  private readonly API_KEY = 'vxDDLFdCxLjyUCumrDGUiFyO7Jsr0Xcd';
  private readonly query = `https://api.giphy.com/v1/gifs/search?api_key=${this.API_KEY}&q=dog&limit=25&offset=0&rating=g&lang=en`;

  otherFetch() {
    return this.http.get(this.query).pipe(
      map((res: unknown) => {
        return match(res)
          .with(
            {
              data: Pattern.array(FixedHeightPattern),
            },
            ({ data }) => data.map((v) => v.images.fixed_height.url)
          )
          .otherwise(() => throwError(() => 'Something bad'));
      })
    );
  }
  fetch() {
    return this.http.get(this.query).pipe(
      tap((res: unknown) => {
        console.log(res);
      }),
      map((res: unknown) => {
        if (
          isMatching(
            {
              data: Pattern.array({
                images: {
                  fixed_height: {
                    url: Pattern.string,
                  },
                },
              }),
            },
            res
          )
        ) {
          return res.data.map((v) => v.images.fixed_height.url);
        }
        return throwError(() => 'Something bad happened');
      })
    );
  }

  constructor() {}
}
