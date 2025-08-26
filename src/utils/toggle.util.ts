import { Model, Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

/**
 * Toggles a boolean attribute for a Mongoose document.
 *
 * @param model - The Mongoose model
 * @param id - The document ID
 * @param attribute - The name of the boolean attribute to toggle
 * @returns The updated document
 */
export async function toggleAttribute<T extends { [key: string]: any }>(
  model: Model<T>,
  id: string | Types.ObjectId,
  attribute: keyof T,
): Promise<T> {
  const document = await model.findById(id);
  if (!document) {
    throw new NotFoundException('Document not found');
  }

  if (typeof document[attribute] !== 'boolean') {
    throw new Error(`Attribute '${String(attribute)}' is not a boolean`);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  document[attribute] = !document[attribute];
  await document.save();

  return document;
}
