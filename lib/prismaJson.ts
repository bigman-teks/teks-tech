import { Prisma } from "@prisma/client";
// Prisma needs an explicit marker (Prisma.JsonNull) to write NULL into a nullable Json column; plain null is a type error.
// undefined means "leave the column unchanged".
export function jsonOrNull(v: unknown) {
  if (v === undefined) return undefined;
  if (v === null) return Prisma.JsonNull;
  return v as Prisma.InputJsonValue;
}
