export function isPrismaKnownRequestError(e: unknown): e is { code: string; meta?: any } {
  return !!e && typeof e === 'object' && 'code' in e!;
}