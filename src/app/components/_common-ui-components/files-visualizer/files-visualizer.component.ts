import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EntityAttachedFile } from 'src/app/models/_ApiBase/EntityAttachedFile';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { ImageViewerComponentData } from 'src/app/models/_ApiBase/ImageViewerComponentData';
import { FormatHelper } from 'src/app/helpers/FormatHelper';

@Component({
  selector: 'app-files-visualizer',
  templateUrl: './files-visualizer.component.html',
  styleUrls: ['./files-visualizer.component.css']
})
export class FilesVisualizerComponent {
  @Output() getImageMediumContent: EventEmitter<EntityAttachedFile> = new EventEmitter();
  @Output() getImageFullContent: EventEmitter<EntityAttachedFile> = new EventEmitter();
  @Output() downloadFileContent: EventEmitter<EntityAttachedFile> = new EventEmitter();
  @Output() deleteFile: EventEmitter<EntityAttachedFile> = new EventEmitter();
  @Input('files')
  get files(): Array<EntityAttachedFile> {
    return this._files;
  }
  set files(newFiles: Array<EntityAttachedFile>) {
    this.ProcessFiles(newFiles);
  }
  @Input() canDelete: boolean = false;
  private _files: Array<EntityAttachedFile> = [];
  private _justFilesFilteredFromFiles: Array<EntityAttachedFile> | null = null;
  private _imagesFilteredFromFiles: Array<EntityAttachedFile> | null = null;
  private _imagesGridRowsCount: number | null = null;
  private _imagesGridRowsCountArray: Array<number> | null = null;

  constructor(private dialog: MatDialog) {

  }

  public getJustFilesFromSelectedFiles(): Array<EntityAttachedFile> {    
    return (this._justFilesFilteredFromFiles
      ?? (this._justFilesFilteredFromFiles = this._files.filter(e => !FormatHelper.IsThisEntityAttachedFileImage(e))));
  }

  public getImagesFromSelectedFiles(): Array<EntityAttachedFile> {
        return (this._imagesFilteredFromFiles
      ?? (this._imagesFilteredFromFiles = this._files.filter(e => FormatHelper.IsThisEntityAttachedFileImage(e))));
  }

  public getRowsCountArray(): Array<number> {    
    return (this._imagesGridRowsCountArray
      ?? (this._imagesGridRowsCountArray = Array.from({ length: this.getImagesGridRowsCount() }, (_, index) => index)));
  }

  public getImagesForRowArray(rowIndex: number): Array<EntityAttachedFile> {
    let arrayStartIndex = rowIndex * (this.getImagesFromSelectedFiles().length == 4 ? 2 : 3);
    if (arrayStartIndex < 0) {
      arrayStartIndex = 0;
    }
    let arrayEndIndex = arrayStartIndex + this.getImagesGridColumnsCountInRowNumber(rowIndex);
    const result = this.getImagesFromSelectedFiles().slice(arrayStartIndex, arrayEndIndex);
    return result;
  }

  public DownloadFileContent(file: EntityAttachedFile) {
    this.downloadFileContent.emit(file);
  }

  public DeleteFile(file: EntityAttachedFile) {
    this.deleteFile.emit(file);
  }

  public OpenImageBigScreen(image: EntityAttachedFile) {
    let data = new ImageViewerComponentData();
    data.currentImageIndex = this.getImagesFromSelectedFiles().findIndex(e => e == image);
    data.images = this.getImagesFromSelectedFiles();
    data.populateImageContentFunc = this.PopulateImageContent.bind(this);
    const dialogFormRef = this.dialog.open(ImageViewerComponent, {
      data: data,
      maxWidth: "100svw",
      maxHeight: "100svh"
    });
  }

  private getImagesGridRowsCount(): number {    
    if (this._imagesGridRowsCount != null) return this._imagesGridRowsCount;
    const totalImagesCount = this.getImagesFromSelectedFiles().length;
    //Особый случай для 4 изображений
    if (totalImagesCount == 4) {
      this._imagesGridRowsCount = 2;
      return this._imagesGridRowsCount;
    }
    if (totalImagesCount == 0 || totalImagesCount == 1) {
      this._imagesGridRowsCount = totalImagesCount;
      return this._imagesGridRowsCount;
    }
    this._imagesGridRowsCount = Math.floor(totalImagesCount / 3) + (totalImagesCount % 3 > 0 ? totalImagesCount % 3 - 1 : 0);
    return this._imagesGridRowsCount;
  }

  private getImagesGridColumnsCountInRowNumber(rowNumber: number): number {
    const totalRowsCount = this.getImagesGridRowsCount();
    if (rowNumber >= totalRowsCount) return -1;
    const totalImagesCount = this.getImagesFromSelectedFiles().length;
    if (rowNumber == totalRowsCount - 1) {
      //Особый случай для 4 изображений
      if (totalImagesCount == 4) {
        return 2;
      }
      switch (totalImagesCount % 3) {
        case 0:
          return 3;
        case 1:
          return 4;
        case 2:
          return 2;
        default:
          return -1;
      }
    }
    else {
      //Особый случай для 4 изображений
      if (totalImagesCount == 4) {
        return 2;
      }
      return 3;
    }
  }

  private PopulateImageContent(image: EntityAttachedFile) {
    this.getImageFullContent.emit(image);
  }

  private ProcessFiles(newFiles: Array<EntityAttachedFile>) {
    this._files = newFiles;
    this._files.forEach(e => {
      if (FormatHelper.IsThisEntityAttachedFileImage(e) && !e?.mediumImage?.fileContent && e.id) {
        this.getImageMediumContent.emit(e)
      }
    })
    this.ResetVariables();
  }

  private ResetVariables() {
    this._justFilesFilteredFromFiles = null;
    this._imagesFilteredFromFiles = null;
    this._imagesGridRowsCount = null;
    this._imagesGridRowsCountArray = null;
  }  
}
//Сетка в формате
//1 = 1
//2 = 2
//3 = 3
//4 = 2 + 2
//5 = 3 + 2
//6 = 3 + 3
//7 = 3 + 4
//8 = 3 + 3 + 2
//9 = 3 + 3 + 3
//10 = 3 + 3 + 4
//11 = 3 + 3 + 3 + 2
//12 = 3 + 3 + 3 + 3
//13 = 3 + 3 + 3 + 4
//14 = 3 + 3 + 3 + 3 + 2
//15 = 3 + 3 + 3 + 3 + 3
//16 = 3 + 3 + 3 + 3 + 4
//17 = 3 + 3 + 3 + 3 + 3 + 2
//18 = 3 + 3 + 3 + 3 + 3 + 3
//19 = 3 + 3 + 3 + 3 + 3 + 4
//20 = 3 + 3 + 3 + 3 + 3 + 3 + 2 