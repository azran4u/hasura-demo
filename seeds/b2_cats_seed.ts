import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("owners").del();

  // Inserts seed entries
  await knex("owners").insert([
    { id: "7ad5294b-92c4-42b1-8438-45b0d521cc35", name: "owner1", age: 1 },
    { id: "7ad5294b-92c4-42b1-8438-45b0d521cc36", name: "owner2", age: 2 },
    { id: "7ad5294b-92c4-42b1-8438-45b0d521cc37", name: "owner3", age: 3 },
  ]);

  await knex("cats").del();

  // Inserts seed entries
  await knex("cats").insert([
    { name: "cat1", age: 1, ownerId: "7ad5294b-92c4-42b1-8438-45b0d521cc35" },
    { name: "cat2", age: 2, ownerId: "7ad5294b-92c4-42b1-8438-45b0d521cc35" },
    { name: "cat3", age: 3, ownerId: "7ad5294b-92c4-42b1-8438-45b0d521cc35" },
  ]);
}
