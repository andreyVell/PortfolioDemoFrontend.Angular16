import { EntityAttachedFile } from "./EntityAttachedFile";

export class ImageViewerComponentData {
    public currentImageIndex: number = 0;
    public images: EntityAttachedFile[] = [];
    public populateImageContentFunc: ((image: EntityAttachedFile) => void) | undefined | null;
}