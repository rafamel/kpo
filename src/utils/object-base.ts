function encode(value: any): string {
  return Buffer.from(JSON.stringify(value)).toString('base64');
}

function decode(value: string): any {
  return JSON.parse(String(Buffer.from(value, 'base64')));
}

export default { encode, decode };
