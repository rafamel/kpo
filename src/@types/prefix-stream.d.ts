declare module 'prefix-stream' {
  import { Transform } from 'stream';
  export default function (str: string): Transform;
}
