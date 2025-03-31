import { join } from 'path';

export namespace Testing {
  export function getHost(version = 'v1'): string {
    return join(`http://localhost:${process.env.PORT}`, (process.env.PREFIX as string) ?? '', version);
  }
}
