import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdaptiveComponent } from 'src/app/models/_AdaptiveComponent/AdaptiveComponent';
import { EntityAttachedFile } from 'src/app/models/_ApiBase/EntityAttachedFile';
import { ImageViewerComponentData } from 'src/app/models/_ApiBase/ImageViewerComponentData';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css']
})
export class ImageViewerComponent extends AdaptiveComponent {
  public currentImageIndex: number = 0;
  public images: EntityAttachedFile[] = [];
  constructor(
    private dialogRef: MatDialogRef<ImageViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageViewerComponentData) {
    super();
    this.currentImageIndex = data.currentImageIndex;
    this.images = data.images;
    this.LoadImage(this.currentImageIndex);
  }
  
  public CloseForm() {
    this.dialogRef.close(false);
  }

  public NextImage() {
    if (this.IsThereANextMessage()) {
      this.currentImageIndex += 1;
      this.LoadImage(this.currentImageIndex);
    }
  }
  public PreviousImage() {
    if (this.IsThereAPreviousMessage()) {
      this.currentImageIndex -= 1;
      this.LoadImage(this.currentImageIndex);
    }
  }

  public IsThereANextMessage(): boolean {
    return this.currentImageIndex < this.images.length - 1;
  }

  public IsThereAPreviousMessage(): boolean {
    return this.currentImageIndex > 0;
  }

  private LoadImage(imageIndex: number): void {
    this.PopulateImageContent(imageIndex);
    if (this.IsThereANextMessage()) {
      this.PopulateImageContent(imageIndex + 1);
    }
    if (this.IsThereAPreviousMessage()) {
      this.PopulateImageContent(imageIndex - 1);
    }
  }

  private PopulateImageContent(imageIndex: number): void {
    let image = this.images[imageIndex];
    if (!image?.fileContent?.fileContent && !image?.fileContent?.isFileContentProcessing) {
      if (this.data.populateImageContentFunc) {
        this.data.populateImageContentFunc(image);
      }
    }
  }
}
