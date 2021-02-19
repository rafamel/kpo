import ObjectPath from 'objectpath';

export function stringifyRoute(route: Array<string | number>): string {
  return ObjectPath.stringify(
    route.map((x) => String(x)),
    "'",
    false
  );
}
