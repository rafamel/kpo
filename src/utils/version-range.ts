import { clean, diff } from 'semver';

export default function inVersionRange(
  executable?: string,
  local?: string
): boolean {
  const versions = [executable && clean(executable), local && clean(local)];
  if (!versions[0] || !versions[1]) throw Error(`Version could not be parsed`);

  const release = diff(versions[0] as string, versions[1] as string);

  // `false` if difference is a major version or we're on v0.x.x
  return (
    release !== 'major' &&
    release !== 'premajor' &&
    (!release || (versions[0] as string)[0] !== '0')
  );
}
