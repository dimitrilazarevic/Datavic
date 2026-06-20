import { getDb } from "..";
import type { Task } from "../../types";
import { task } from "../schema";

export async function getTasks() : Promise<Task[]> {
    return getDb().select().from(task).all();
}