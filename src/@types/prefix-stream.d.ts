declare module 'prefix-stream' {
  type Transform = import('node:stream').Transform;
  export default function transform(str: string): Transform;
}
