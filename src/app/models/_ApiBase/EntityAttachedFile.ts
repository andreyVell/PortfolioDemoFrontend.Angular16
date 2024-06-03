import { AttachFileModel } from "./AttachFileModel";
import { EntityBase } from "./EntityBase";

export class EntityAttachedFile extends EntityBase{
    public fileName: string | null = null;    
    public isFileDownloading: boolean = false;
    public isFileCreating: boolean = false;
    public fileContent: AttachFileModel = new AttachFileModel();
    public mediumImage: AttachFileModel = new AttachFileModel();

    constructor(init?: Partial<EntityAttachedFile>, fileContent: AttachFileModel | null = null) {
        super();
        Object.assign(this, init);        
        if (fileContent){
            this.fileContent = new AttachFileModel(fileContent);
        }
    }
}