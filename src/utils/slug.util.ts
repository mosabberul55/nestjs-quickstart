import slugify from 'slugify';
import { transliterate } from 'transliteration';
import { Model } from 'mongoose';

export async function generateUniqueSlug<T>(
  model: Model<T>,
  name: string,
  excludeId?: string,
): Promise<string> {
  // ✅ Transliterate Bangla -> English phonetic
  const transliteratedName = transliterate(name);

  // ✅ Then slugify
  const baseSlug = slugify(transliteratedName, {
    lower: true,
    strict: true,
    trim: true,
  });

  let uniqueSlug = baseSlug;
  let count = 0;

  // ✅ Ensure uniqueness
  while (
    await model.exists({
      slug: uniqueSlug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
  ) {
    count += 1;
    uniqueSlug = `${baseSlug}-${count}`;
  }

  return uniqueSlug;
}

export async function updateSlug<T>(
  model: Model<T>,
  id: string,
  name: string,
): Promise<string> {
  const transliteratedName = transliterate(name);
  const baseSlug = slugify(transliteratedName, { lower: true, strict: true });

  let uniqueSlug = baseSlug;
  let count = 0;

  while (
    await model.exists({
      slug: uniqueSlug,
      _id: { $ne: id },
    })
  ) {
    count += 1;
    uniqueSlug = `${baseSlug}-${count}`;
  }

  return uniqueSlug;
}
