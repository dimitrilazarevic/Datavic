import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type { task } from '../db/schema';

export type Task = InferSelectModel<typeof task>;
export type TaskInsert = InferInsertModel<typeof task>;
