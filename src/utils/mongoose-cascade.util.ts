import { Schema, HydratedDocument, Query } from 'mongoose';

export function cascadeDelete(
  schema: Schema,
  relatedModel: string,
  foreignKeyField: string,
) {
  // Document middleware for `document.deleteOne()`
  schema.pre(
    'deleteOne',
    { document: true, query: false },
    async function (next) {
      const doc = this as HydratedDocument<any>;
      console.log(
        `Cascade deleting from ${relatedModel} where ${foreignKeyField}=${doc._id}`,
      );
      await doc.model(relatedModel).deleteMany({
        [foreignKeyField]: doc._id,
      });
      next();
    },
  );

  // Query middleware for `findOneAndDelete`, `deleteOne`, `deleteMany`
  schema.pre(
    ['findOneAndDelete', 'deleteOne', 'deleteMany'],
    { document: false, query: true },
    async function (next) {
      const query = this as Query<any, any>;
      const filter = query.getFilter();
      const docs = await query.model.find(filter);
      for (const doc of docs) {
        console.log(
          `Cascade deleting from ${relatedModel} where ${foreignKeyField}=${doc._id}`,
        );
        await query.model.db.model(relatedModel).deleteMany({
          [foreignKeyField]: doc._id,
        });
      }
      next();
    },
  );
}