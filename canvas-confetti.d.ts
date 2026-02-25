declare module 'canvas-confetti' {
  export interface Options {
    [key: string]: unknown;
  }

  export type CreateTypes = (options?: Options) => Promise<undefined> | null;

  const confetti: CreateTypes;
  export default confetti;
}
