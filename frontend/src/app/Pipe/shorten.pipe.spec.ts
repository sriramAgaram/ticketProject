import { ShortenPipe } from './shorten.pipe';

describe('ShortenPipe', () => {
  let pipe: ShortenPipe;

  beforeEach(() => {
    pipe = new ShortenPipe();
  });

  it('should create instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should shorten long strings', () => {
    const input = 'This is a long String it should return only limit characters';
    const result = pipe.transform(input, 10);
    expect(result).toBe('This is a ...');  
  });

  it('should not shorten if the string is within the limit', () => {
    const input = 'short';
    const result = pipe.transform(input, 10);
    expect(result).toBe('short');
  });
  

  it('should return empty string if input is empty', () => {
    const result = pipe.transform('', 10);
    expect(result).toBe('');
  });

  it('should use default limit (10) if no limit passed', () => {
    const input = 'Hello World!';
    const result = pipe.transform(input);
    expect(result).toBe('Hello Worl...');  
  });
});
