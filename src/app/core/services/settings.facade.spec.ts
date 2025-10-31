import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SettingsFacade } from './settings.facade';
import { SettingsApiService } from './settings-api.service';
import { SettingsStateService } from '@core/state/settings.state';
import { TimerSettings, SettingsResponse } from '@core/models/timer.models';

describe('SettingsFacade', () => {
  let facade: SettingsFacade;
  let mockApiService: jest.Mocked<SettingsApiService>;
  let mockStateService: jest.Mocked<SettingsStateService>;

  const mockSettings: TimerSettings = {
    focusDuration: 1500,
    shortBreakDuration: 300,
    longBreakDuration: 900,
  };

  const mockSettingsResponse: SettingsResponse = {
    success: true,
    settings: mockSettings,
  };

  const mockUpdatedSettings: TimerSettings = {
    focusDuration: 1800,
    shortBreakDuration: 600,
    longBreakDuration: 1200,
  };

  beforeEach(() => {
    const apiServiceMock = {
      getSettings: jest.fn().mockReturnValue(of(mockSettings)),
      updateSettings: jest.fn(),
      resetSettings: jest.fn(),
    };

    const stateServiceMock = {
      getState: jest.fn().mockReturnValue(of(mockSettings)),
      getCurrentState: jest.fn().mockReturnValue(mockSettings),
      setState: jest.fn(),
      updateState: jest.fn(),
      resetState: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        SettingsFacade,
        { provide: SettingsApiService, useValue: apiServiceMock },
        { provide: SettingsStateService, useValue: stateServiceMock },
      ],
    });

    mockApiService = TestBed.inject(SettingsApiService) as jest.Mocked<SettingsApiService>;
    mockStateService = TestBed.inject(SettingsStateService) as jest.Mocked<SettingsStateService>;
  });

  it('should be created', () => {
    facade = TestBed.inject(SettingsFacade);
    expect(facade).toBeTruthy();
  });

  describe('constructor', () => {
    it('should load settings on initialization', () => {
      facade = TestBed.inject(SettingsFacade);

      expect(mockApiService.getSettings).toHaveBeenCalled();
    });

    it('should update state with loaded settings', () => {
      facade = TestBed.inject(SettingsFacade);

      expect(mockStateService.setState).toHaveBeenCalledWith(mockSettings);
    });

    it('should handle load errors gracefully', () => {
      mockApiService.getSettings.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      jest.spyOn(console, 'error').mockImplementation();

      facade = TestBed.inject(SettingsFacade);

      expect(console.error).toHaveBeenCalledWith(
        'Failed to load settings:',
        expect.any(Error)
      );
      expect(mockStateService.setState).not.toHaveBeenCalled();
    });
  });

  describe('settings$', () => {
    it('should expose settings observable from state service', (done) => {
      facade = TestBed.inject(SettingsFacade);

      facade.settings$.subscribe((settings) => {
        expect(settings).toEqual(mockSettings);
        done();
      });
    });
  });

  describe('currentSettings', () => {
    it('should return current settings synchronously', () => {
      facade = TestBed.inject(SettingsFacade);

      const settings = facade.currentSettings;

      expect(settings).toEqual(mockSettings);
      expect(mockStateService.getCurrentState).toHaveBeenCalled();
    });
  });

  describe('updateSettings', () => {
    beforeEach(() => {
      facade = TestBed.inject(SettingsFacade);
      // Clear the call from constructor
      mockApiService.updateSettings.mockClear();
      mockStateService.setState.mockClear();
    });

    it('should call API service to update settings', (done) => {
      const partialSettings: Partial<TimerSettings> = {
        focusDuration: 1800,
      };

      mockApiService.updateSettings.mockReturnValue(
        of({
          success: true,
          settings: { ...mockSettings, ...partialSettings },
        })
      );

      facade.updateSettings(partialSettings).subscribe(() => {
        expect(mockApiService.updateSettings).toHaveBeenCalledWith(partialSettings);
        done();
      });
    });

    it('should update state on successful API response', (done) => {
      const updatedResponse: SettingsResponse = {
        success: true,
        settings: mockUpdatedSettings,
      };

      mockApiService.updateSettings.mockReturnValue(of(updatedResponse));

      facade.updateSettings(mockUpdatedSettings).subscribe(() => {
        expect(mockStateService.setState).toHaveBeenCalledWith(mockUpdatedSettings);
        done();
      });
    });

    it('should return true on successful update', (done) => {
      mockApiService.updateSettings.mockReturnValue(of(mockSettingsResponse));

      facade.updateSettings(mockSettings).subscribe((success) => {
        expect(success).toBe(true);
        done();
      });
    });

    it('should return false when API returns success: false', (done) => {
      const failureResponse: SettingsResponse = {
        success: false,
        settings: mockSettings,
      };

      mockApiService.updateSettings.mockReturnValue(of(failureResponse));

      facade.updateSettings(mockSettings).subscribe((success) => {
        expect(success).toBe(false);
        expect(mockStateService.setState).not.toHaveBeenCalled();
        done();
      });
    });

    it('should handle API errors and return false', (done) => {
      mockApiService.updateSettings.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      jest.spyOn(console, 'error').mockImplementation();

      facade.updateSettings(mockSettings).subscribe((success) => {
        expect(success).toBe(false);
        expect(console.error).toHaveBeenCalledWith(
          'Failed to update settings:',
          expect.any(Error)
        );
        expect(mockStateService.setState).not.toHaveBeenCalled();
        done();
      });
    });

    it('should not update state on API error', (done) => {
      mockApiService.updateSettings.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      facade.updateSettings(mockSettings).subscribe(() => {
        expect(mockStateService.setState).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('resetSettings', () => {
    beforeEach(() => {
      facade = TestBed.inject(SettingsFacade);
      // Clear the call from constructor
      mockApiService.resetSettings.mockClear();
      mockStateService.setState.mockClear();
    });

    it('should call API service to reset settings', () => {
      mockApiService.resetSettings.mockReturnValue(of(mockSettingsResponse));

      facade.resetSettings();

      expect(mockApiService.resetSettings).toHaveBeenCalled();
    });

    it('should update state with default settings on success', () => {
      const defaultResponse: SettingsResponse = {
        success: true,
        settings: {
          focusDuration: 1500,
          shortBreakDuration: 300,
          longBreakDuration: 900,
        },
      };

      mockApiService.resetSettings.mockReturnValue(of(defaultResponse));

      facade.resetSettings();

      expect(mockStateService.setState).toHaveBeenCalledWith(defaultResponse.settings);
    });

    it('should not update state when API returns success: false', () => {
      const failureResponse: SettingsResponse = {
        success: false,
        settings: mockSettings,
      };

      mockApiService.resetSettings.mockReturnValue(of(failureResponse));

      facade.resetSettings();

      expect(mockStateService.setState).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', () => {
      mockApiService.resetSettings.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      jest.spyOn(console, 'error').mockImplementation();

      facade.resetSettings();

      expect(console.error).toHaveBeenCalledWith(
        'Failed to reset settings:',
        expect.any(Error)
      );
      expect(mockStateService.setState).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroy$ subject', () => {
      facade = TestBed.inject(SettingsFacade);

      expect(() => facade.ngOnDestroy()).not.toThrow();
    });
  });
});
