import { styleString } from './style-string';
import { ensure } from 'errorish';
import { into } from 'pipettes';

export function formatMessage(error: Error): string {
  return into(
    ensure(error, null, { normalize: true }).message,
    (msg) => msg[0].toUpperCase() + msg.slice(1).toString(),
    (msg) => styleString(msg, { bold: true })
  );
}
