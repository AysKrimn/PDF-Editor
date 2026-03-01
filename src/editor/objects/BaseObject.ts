let counter = 0;

export function generateId(label?: string): string {
  counter += 1;
  const id = label ? `${label}-${counter}` : `obj-${counter}`;
  return id;
}
