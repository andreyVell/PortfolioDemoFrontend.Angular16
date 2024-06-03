export class EntityBase {
    public id: string = '';
    public createdByUser: string = '';
    public updatedByUser: string = '';
    public createdOn!: Date;
    public updatedOn!: Date;
}