declare module 'prefix-stream' {
  import { Transform } from 'node:stream';
  export default function (str: string): Transform;
}
