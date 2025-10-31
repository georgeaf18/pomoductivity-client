import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SettingsApiService } from './settings-api.service';
import { TimerSettings, SettingsResponse } from '@core/models/timer.models';
import { environment } from '../../../environments/environment';

describe('SettingsApiService', () => {
  let service: SettingsApiService;
  let httpMock: HttpTestingController;

  const mockSettings: TimerSettings = {
    focusDuration: 1500,
    shortBreakDuration: 300,
    longBreakDuration: 900,
  };

  const mockSettingsResponse: SettingsResponse = {
    success: true,
    settings: mockSettings,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SettingsApiService],
    });
    service = TestBed.inject(SettingsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSettings', () => {
    it('should make a GET request to /api/settings', () => {
      service.getSettings().subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/settings`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSettings);
    });

    it('should return settings data', (done) => {
      service.getSettings().subscribe((settings) => {
        expect(settings).toEqual(mockSettings);
        expect(settings.focusDuration).toBe(1500);
        expect(settings.shortBreakDuration).toBe(300);
        expect(settings.longBreakDuration).toBe(900);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/settings`);
      req.flush(mockSettings);
    });

    it('should handle HTTP errors', (done) => {
      service.getSettings().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/settings`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('updateSettings', () => {
    it('should make a PUT request to /api/settings', () => {
      const partialSettings: Partial<TimerSettings> = {
        focusDuration: 1800,
      };

      service.updateSettings(partialSettings).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/settings`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(partialSettings);
      req.flush(mockSettingsResponse);
    });

    it('should return a SettingsResponse', (done) => {
      const partialSettings: Partial<TimerSettings> = {
        focusDuration: 1800,
        shortBreakDuration: 600,
      };

      service.updateSettings(partialSettings).subscribe((response) => {
        expect(response).toEqual(mockSettingsResponse);
        expect(response.success).toBe(true);
        expect(response.settings).toEqual(mockSettings);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/settings`);
      req.flush(mockSettingsResponse);
    });

    it('should handle update failure from server', (done) => {
      const failureResponse: SettingsResponse = {
        success: false,
        settings: mockSettings,
      };

      service.updateSettings({ focusDuration: 1800 }).subscribe((response) => {
        expect(response.success).toBe(false);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/settings`);
      req.flush(failureResponse);
    });

    it('should handle HTTP errors', (done) => {
      service.updateSettings({ focusDuration: 1800 }).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/settings`);
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('resetSettings', () => {
    it('should make a POST request to /api/settings/reset', () => {
      service.resetSettings().subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/settings/reset`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(mockSettingsResponse);
    });

    it('should return default settings in response', (done) => {
      const defaultResponse: SettingsResponse = {
        success: true,
        settings: {
          focusDuration: 1500,
          shortBreakDuration: 300,
          longBreakDuration: 900,
        },
      };

      service.resetSettings().subscribe((response) => {
        expect(response.success).toBe(true);
        expect(response.settings.focusDuration).toBe(1500);
        expect(response.settings.shortBreakDuration).toBe(300);
        expect(response.settings.longBreakDuration).toBe(900);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/settings/reset`);
      req.flush(defaultResponse);
    });

    it('should handle HTTP errors', (done) => {
      service.resetSettings().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/settings/reset`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
