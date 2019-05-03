export default function purePath(path: string): string {
  return path.replace(/\.\$?default\./g, '.').replace(/\.\$?default$/, '');
}
