export class AttachFileModel {
    fileName: string | null = null;
    fileContent: string | null = null;
    isFileContentProcessing: boolean = false;
    private _fileSize: string = '';
    constructor(init?: Partial<AttachFileModel>) {
        Object.assign(this, init);
    }

    public GetFileSize(): string {        
        if (this._fileSize) return this._fileSize;
        if (!this.fileContent) return '';
        const base64Data = this.fileContent.replace(/^data:[^;]+;base64,/, '');
        const binaryData = atob(base64Data);
        const fileSizeInBytes = binaryData.length;
        if (fileSizeInBytes < 1024) {
            this._fileSize = fileSizeInBytes.toFixed(0) + ' Б';
            return this._fileSize;
        }
        const fileSizeInKB = fileSizeInBytes / 1024;
        if (fileSizeInKB < 1024) {
            this._fileSize = fileSizeInKB.toFixed(0) + ' КБ'
            return this._fileSize;
        }
        const fileSizeInMB = fileSizeInKB / 1024;
        this._fileSize = fileSizeInMB.toFixed(0) + ' МБ'
        return this._fileSize;
    }
}