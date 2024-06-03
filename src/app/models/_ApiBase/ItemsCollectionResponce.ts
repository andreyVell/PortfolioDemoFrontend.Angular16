export class ItemsCollectionResponce<T> {
    items: Array<T> = [];
    totalItems: number = 0;
    startIndex: number = 0;
    itemsPerPage: number = 0;
}