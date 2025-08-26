import { Model, Types } from 'mongoose';

export async function arrangeOrders(
  model: Model<any>,
  items: { _id: Types.ObjectId | string }[],
): Promise<void> {
  if (!items || items.length === 0) return;

  const bulkOps = items.map((item, index) => ({
    updateOne: {
      filter: { _id: item._id },
      update: { $set: { order: Number(index + 1) } },
    },
  }));

  await model.bulkWrite(bulkOps);
}
