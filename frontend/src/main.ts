import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

console.log('🧪 main.ts: Bootstrapping Angular...');

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    console.log('✅ Angular bootstrap successful!');
  })
  .catch((err) => console.error('❌ Bootstrap failed:', err));
