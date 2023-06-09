import { Id, Identifiable, IStorage } from "@infrastructure/storage/typings.d.ts";

export class LocalStorage<T extends Identifiable> implements IStorage<T> {
  protected storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  protected loadData(): T[] {
    return JSON.parse(localStorage.getItem(this.storageKey) ?? "[]");
  }

  protected saveData(items: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  public getAll(): Promise<T[]> {
    return Promise.resolve(this.loadData());
  }

  public getById(id: Id): Promise<T | null> {
    const items = this.loadData();
    return Promise.resolve(items.find((item: T) => item.id === id) || null);
  }

  public create(item: T): Promise<T> {
    const items = this.loadData();
    items.push(item);
    this.saveData(items);
    return Promise.resolve(item);
  }

  public update(id: Id, item: T): Promise<T | null> {
    const items = this.loadData();
    const itemIndex = items.findIndex((existingItem: T) =>
      existingItem.id === id
    );

    if (itemIndex === -1) {
      return Promise.resolve(null);
    }

    items[itemIndex] = item;
    this.saveData(items);

    return Promise.resolve(item);
  }

  public upsert(item: T): Promise<T> {
    const items = this.loadData();
    const itemIndex = items.findIndex((existingItem: T) =>
      existingItem.id === item.id
    );

    if (itemIndex === -1) {
      items.push(item);
    } else {
      items[itemIndex] = item;
    }

    this.saveData(items);

    return Promise.resolve(item);
  }

  public delete(id: Id): Promise<boolean> {
    const items = this.loadData();
    const itemIndex = items.findIndex((existingItem: T) =>
      existingItem.id === id
    );

    if (itemIndex === -1) {
      return Promise.resolve(false);
    }

    items.splice(itemIndex, 1);
    this.saveData(items);

    return Promise.resolve(true);
  }
}
