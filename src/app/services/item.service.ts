import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  items: Array<any> = [
    {
      'id': '1',
      'title': 'Geolocation',
      'description': 'Scan single geo position and activate watcher for multi scanning'
    }
  ]

  constructor() { }

  createItem(title, description) {

    const randomId = Math.random().toString(36).substr(2, 5);

    this.items.push({
      'id': randomId,
      'title': title,
      'description': description
    });
  }

  getItems() {
    return this.items;
  }

  getItemById(id) {
    return this.items.filter(item => item.id === id);
  }

  updateItem(newValues) {
    const itemIndex = this.items.findIndex(item => item.id === newValues.id);
    this.items[itemIndex] = newValues;
  }
}
