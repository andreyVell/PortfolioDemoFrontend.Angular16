import { MatSnackBar } from "@angular/material/snack-bar";
import { AttachFileModel } from "../models/_ApiBase/AttachFileModel";
import { WrapperForValueType } from "../models/_ApiBase/WrapperForValueType";
import { NgxImageCompressService } from "ngx-image-compress";
import { EntityAttachedFile } from "../models/_ApiBase/EntityAttachedFile";

export class FormatHelper {
    public static imageExtensions = ['.png', '.jpg', '.jpeg', '.jfif', '.gif', '.svg', '.ico', '.bmp', '.webp', '.tiff', '.tif'];
    private static _imageCompressService: NgxImageCompressService;

    public static Initialize(imageCompressService: NgxImageCompressService): void {
        this._imageCompressService = imageCompressService;
    }

    public static DateToISOFormatString(date: Date | null | undefined): string | null {
        "2023-10-31T19:00:00.000Z"
        if (!date) return null;
        if (!(date instanceof Date)) return null;
        const yyyyStr = date.getFullYear().toString();
        let MM = date.getMonth() + 1; // Months start at 0!
        let MMStr: string = '';
        let dd = date.getDate();
        let ddStr: string = '';
        let hh = date.getHours();
        let hhStr: string = '';
        let mm = date.getMinutes();
        let mmStr: string = '';
        let ss = date.getSeconds();
        let ssStr: string = '';
        let ms = date.getMilliseconds();
        let msStr: string = '';

        if (dd < 10) {
            ddStr = '0' + dd;
        }
        else {
            ddStr = dd.toString();
        }

        if (MM < 10) {
            MMStr = '0' + MM;
        }
        else {
            MMStr = MM.toString();
        }

        if (hh < 10) {
            hhStr = '0' + hh;
        }
        else {
            hhStr = hh.toString();
        }

        if (mm < 10) {
            mmStr = '0' + mm;
        }
        else {
            mmStr = mm.toString();
        }

        if (ss < 10) {
            ssStr = '0' + ss;
        }
        else {
            ssStr = ss.toString();
        }

        if (ms < 100) {
            if (ms < 10) {
                msStr = '00' + ms;
            }
            else {
                msStr = '0' + ms;
            }
        }
        else {
            msStr = ms.toString();
        }

        const formattedDate = yyyyStr + '-' + MMStr + '-' + ddStr + 'T' + hhStr + ':' + mmStr + ':' + ssStr + '.' + msStr + 'Z';
        return formattedDate;
    }

    public static DateToShortString(date: Date | null | undefined): string {
        "31.12.2023"

        if (!date) return '';
        if (!(date instanceof Date)) return '';
        const yyyyStr = date.getFullYear().toString();
        let MM = date.getMonth() + 1; // Months start at 0!
        let MMStr: string = '';
        let dd = date.getDate();
        let ddStr: string = '';
        let hh = date.getHours();
        let hhStr: string = '';

        if (dd < 10) {
            ddStr = '0' + dd;
        }
        else {
            ddStr = dd.toString();
        }

        if (MM < 10) {
            MMStr = '0' + MM;
        }
        else {
            MMStr = MM.toString();
        }

        if (hh < 10) {
            hhStr = '0' + hh;
        }
        else {
            hhStr = hh.toString();
        }

        const formattedDate = ddStr + '.' + MMStr + '.' + yyyyStr;
        return formattedDate;
    }

    public static IsThisEntityAttachedFileImage(file: EntityAttachedFile): boolean {
        let fileExtention = file.fileName?.substring(file.fileName.lastIndexOf('.')).toLowerCase();
        return FormatHelper.imageExtensions.includes(fileExtention ?? '') || file.fileContent.fileContent?.substring(5, 10) == 'image';
    }

    public static IsThisAttachFileModelImage(file: AttachFileModel): boolean {
        let fileExtention = file.fileName?.substring(file.fileName.lastIndexOf('.')).toLowerCase();
        return FormatHelper.imageExtensions.includes(fileExtention ?? '') || file.fileContent?.substring(5, 10) == 'image';
    }

    public static ProcessFilesFromInput(
        filesInput: HTMLInputElement,
        filesProcessingIndicator: WrapperForValueType<boolean>,
        snackBar: MatSnackBar,
        callBackFunctionOnFileProcessed: Function | null = null): Array<AttachFileModel> {
        let selectedFiles = filesInput.files as FileList;
        let files = Array.from(selectedFiles);
        if (files.length > 0) {
            filesProcessingIndicator.value = true;
        }
        let processedFiles: Array<AttachFileModel> = [];
        files.forEach((file: File) => {
            //100MB limit
            if (file.size > 104857600) {
                snackBar.open(
                    'Не удалось прикрепить файл "' + file.name + '". Максимальный допустимый размер файла 100МБ.',
                    "Ок", {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 10000,
                    panelClass: ['snack-bar-error']
                });
                if (files.length == 1) {
                    filesProcessingIndicator.value = false;
                }
                return;
            }
            let afm = new AttachFileModel();
            afm.fileName = file.name;
            afm.isFileContentProcessing = true;
            this.ConvertFileContentToBase64String(afm, file, filesProcessingIndicator, processedFiles, callBackFunctionOnFileProcessed);
            processedFiles.push(afm);
        });
        return processedFiles;
    }

    private static ConvertFileContentToBase64String(
        destinationAttachedFileModel: AttachFileModel,
        sourceFile: File,
        filesProcessingIndicator: WrapperForValueType<boolean>,
        filesArray: Array<AttachFileModel>,
        callBackFunctionOnFileProcessed: Function | null = null) {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            let result = reader.result;
            destinationAttachedFileModel.fileContent = result?.toString() ?? null;
            
            if (this.IsThisAttachFileModelImage(destinationAttachedFileModel) && destinationAttachedFileModel.fileContent) {
                this._imageCompressService
                    .compressFile(destinationAttachedFileModel.fileContent!, -1, 50, 70) // 50% ratio, 70% quality
                    .then(compressedImage => {                        
                        // let beforeSize = this._imageCompressService.byteCount(destinationAttachedFileModel.fileContent!);
                        // let afterSize = this._imageCompressService.byteCount(compressedImage);
                        // console.log(`Размер ДО сжатия ${beforeSize / 1024 / 1024} МБ`);
                        // console.log(`Размер ПОСЛЕ сжатия ${afterSize / 1024 / 1024} МБ`);
                        // console.log(`Сжат в ${beforeSize / afterSize} раз(а)`);

                        destinationAttachedFileModel.fileContent = compressedImage;
                        destinationAttachedFileModel.isFileContentProcessing = false;
                        filesProcessingIndicator.value = this.IsAtLeastOneFileBeingProcessed(filesArray);
                        if (callBackFunctionOnFileProcessed) {
                            callBackFunctionOnFileProcessed(destinationAttachedFileModel);
                        }
                    });
            }
            else {
                destinationAttachedFileModel.isFileContentProcessing = false;
                filesProcessingIndicator.value = this.IsAtLeastOneFileBeingProcessed(filesArray);
                if (callBackFunctionOnFileProcessed) {
                    callBackFunctionOnFileProcessed(destinationAttachedFileModel);
                }
            }

        }, false);

        if (sourceFile) {
            reader.readAsDataURL(sourceFile);
        }
    }


    private static IsAtLeastOneFileBeingProcessed(filesArray: Array<AttachFileModel>): boolean {
        let check: boolean = false;
        filesArray.forEach((file: AttachFileModel) => {
            check = check || file.isFileContentProcessing;
        });
        return check;
    }
}