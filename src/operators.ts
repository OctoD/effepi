export function put<TValue>(value: TValue): () => TValue {
  return () => value;
}
