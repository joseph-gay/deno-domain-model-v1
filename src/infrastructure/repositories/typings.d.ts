// deno-lint-ignore-file no-empty-interface
import { Identifiable, Id } from "@infrastructure/storage/mod.ts";
import { Contact } from "@domain/contact/mod.ts";
import { Account } from "@domain/account/mod.ts";

export interface IRepository<T extends Identifiable> {
  getAll(): Promise<T[]>;
  getById(id: Id): Promise<T | null>;
  create(item: T): Promise<T>;
  update(id: Id, item: T): Promise<T | null>;
  upsert(item: T): Promise<T>;
  delete(id: Id): Promise<boolean>;
}

export interface IContactRepository extends IRepository<Contact> {}

export interface IAccountRepository extends IRepository<Account> {}
