declare module 'culori' {
  export function formatRgb(color: any): string;
  export function formatHex(color: any): string;
  export function parse(color: string): any;
  export function converter(targetMode: string): (color: any) => any;
}
