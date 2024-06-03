import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AttachFileModel } from 'src/app/models/_ApiBase/AttachFileModel';

@Component({
  selector: 'app-selected-local-files-visualizer',
  templateUrl: './selected-local-files-visualizer.component.html',
  styleUrls: ['./selected-local-files-visualizer.component.css']
})
export class SelectedLocalFilesVisualizerComponent {
  @Input() selectedLocalFiles: Array<AttachFileModel> = [];
  @Input() filesMaxHeight: number | null = null;
  @Output() deleteFile: EventEmitter<AttachFileModel> = new EventEmitter<AttachFileModel>();
  public defaultImageSrc: string = 'assets/images/AVETON_64.png';
  private imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.bmp', '.webp', '.tiff', '.tif']


  public DeleteFile(file: AttachFileModel) {
    this.deleteFile.emit(file);
  }


  public GetImagesFromSelectedFiles(): Array<AttachFileModel> {
    return this.selectedLocalFiles.filter(e => this.IsThisFileImage(e));
  }

  public GetJustFilesFromSelectedFiles(): Array<AttachFileModel> {
    return this.selectedLocalFiles.filter(e => !this.IsThisFileImage(e));
  }

  private IsThisFileImage(file: AttachFileModel): boolean {
    let fileExtention = file.fileName?.substring(file.fileName.lastIndexOf('.')).toLowerCase();
    return this.imageExtensions.includes(fileExtention ?? '') || file.fileContent?.substring(5, 10) == 'image';
  }
}
