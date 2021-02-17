declare module 'objectpath' {
  const ObjectPath: {
    parse(str: string, quote?: string, forceQuote?: boolean): string[];
    stringify(arr: string[], quote?: string, forceQuote?: boolean): string;
  };
  export default ObjectPath;
}
