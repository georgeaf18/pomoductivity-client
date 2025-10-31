import { TestBed } from '@angular/core/testing';
import { SettingsStateService } from './settings.state';
import { TimerSettings } from '@core/models/timer.models';

describe('SettingsStateService', () => {
  let service: SettingsStateService;

  const DEFAULT_SETTINGS: TimerSettings = {
    focusDuration: 1500,
    shortBreakDuration: 300,
    longBreakDuration: 900,
  };

  const CUSTOM_SETTINGS: TimerSettings = {
    focusDuration: 2400,
    shortBreakDuration: 600,
    longBreakDuration: 1200,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SettingsStateService],
    });
    service = TestBed.inject(SettingsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getState', () => {
    it('should return an observable of the current state', (done) => {
      service.getState().subscribe((state) => {
        expect(state).toEqual(DEFAULT_SETTINGS);
        done();
      });
    });

    it('should emit updates when state changes', (done) => {
      const emissions: TimerSettings[] = [];

      service.getState().subscribe((state) => {
        emissions.push(state);

        if (emissions.length === 2) {
          expect(emissions[0]).toEqual(DEFAULT_SETTINGS);
          expect(emissions[1]).toEqual(CUSTOM_SETTINGS);
          done();
        }
      });

      service.setState(CUSTOM_SETTINGS);
    });
  });

  describe('getCurrentState', () => {
    it('should return the current state synchronously', () => {
      const state = service.getCurrentState();
      expect(state).toEqual(DEFAULT_SETTINGS);
    });

    it('should return the updated state after setState', () => {
      service.setState(CUSTOM_SETTINGS);
      const state = service.getCurrentState();
      expect(state).toEqual(CUSTOM_SETTINGS);
    });
  });

  describe('setState', () => {
    it('should update the entire state', (done) => {
      service.setState(CUSTOM_SETTINGS);

      service.getState().subscribe((state) => {
        expect(state).toEqual(CUSTOM_SETTINGS);
        done();
      });
    });

    it('should replace all properties', () => {
      service.setState(CUSTOM_SETTINGS);
      const state = service.getCurrentState();

      expect(state.focusDuration).toBe(2400);
      expect(state.shortBreakDuration).toBe(600);
      expect(state.longBreakDuration).toBe(1200);
    });
  });

  describe('updateState', () => {
    it('should partially update the state', () => {
      service.updateState({ focusDuration: 1800 });
      const state = service.getCurrentState();

      expect(state.focusDuration).toBe(1800);
      expect(state.shortBreakDuration).toBe(300); // unchanged
      expect(state.longBreakDuration).toBe(900); // unchanged
    });

    it('should merge partial updates correctly', (done) => {
      service.updateState({
        focusDuration: 1800,
        shortBreakDuration: 420
      });

      service.getState().subscribe((state) => {
        expect(state.focusDuration).toBe(1800);
        expect(state.shortBreakDuration).toBe(420);
        expect(state.longBreakDuration).toBe(900); // unchanged
        done();
      });
    });
  });

  describe('resetState', () => {
    it('should reset state to defaults', () => {
      service.setState(CUSTOM_SETTINGS);
      service.resetState();
      const state = service.getCurrentState();

      expect(state).toEqual(DEFAULT_SETTINGS);
    });

    it('should emit default settings to observers', (done) => {
      service.setState(CUSTOM_SETTINGS);

      let emissionCount = 0;
      service.getState().subscribe((state) => {
        emissionCount++;

        // Skip the first emission (CUSTOM_SETTINGS)
        if (emissionCount === 2) {
          expect(state).toEqual(DEFAULT_SETTINGS);
          done();
        }
      });

      service.resetState();
    });
  });
});
