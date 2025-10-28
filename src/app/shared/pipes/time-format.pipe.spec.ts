import { TimeFormatPipe } from './time-format.pipe';

describe('TimeFormatPipe', () => {
  let pipe: TimeFormatPipe;

  beforeEach(() => {
    pipe = new TimeFormatPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format seconds to MM:SS format', () => {
    expect(pipe.transform(0)).toBe('00:00');
    expect(pipe.transform(59)).toBe('00:59');
    expect(pipe.transform(60)).toBe('01:00');
    expect(pipe.transform(125)).toBe('02:05');
    expect(pipe.transform(1500)).toBe('25:00');
  });

  it('should pad single digits with zero', () => {
    expect(pipe.transform(5)).toBe('00:05');
    expect(pipe.transform(65)).toBe('01:05');
  });
});
