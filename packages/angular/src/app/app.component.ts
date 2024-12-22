import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GiphyService } from './giphy.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly giphyService = inject(GiphyService);

  images$!: Observable<any>;
  title = 'angular';
  region = import.meta.env['NG_APP_REGION'];

  ngOnInit() {
    this.images$ = this.giphyService.fetch();
  }
}
