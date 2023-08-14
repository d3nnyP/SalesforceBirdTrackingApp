import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveAttachment from '@salesforce/apex/BirdController.saveAttachment';
import getAttachment from '@salesforce/apex/BirdController.getAttachment';
import getBird from '@salesforce/apex/BirdController.getBird';

export default class BirdImageUpload extends LightningElement {
    @api recordId;
    @track imageUrl;
    @track file;
    @track uploadDisabled = true;
    @track birdName;

    @wire(getBird, { birdId: '$recordId' })
    wiredBird({ error, data }) {
        if (data) {
            this.birdName = data.Name;
        } else if (error) {
            console.error(error);
        }
    }

    connectedCallback() {
        getAttachment({ parentId: this.recordId })
            .then(result => {
                if (result && result.Id) {
                    this.imageUrl = '/servlet/servlet.FileDownload?file=' + result.Id;
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    handleFileChange(event) {
        this.file = event.target.files[0];
        this.imageUrl = URL.createObjectURL(this.file);
        this.uploadDisabled = false;
    }

    handleUpload() {
        const reader = new FileReader();
        reader.onload = () => {
            const fileContents = reader.result;
            const base64 = 'base64,';
            const dataStart = fileContents.indexOf(base64) + base64.length;
            const fileData = fileContents.substring(dataStart);
            const fileName = this.file.name;
            const contentType = this.file.type;

            saveAttachment({ parentId: this.recordId, fileName: fileName, contentType: contentType, base64Data: fileData })
                .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Attachment uploaded successfully',
                            variant: 'success'
                        })
                    );
                    this.file = null;
                    this.imageUrl = null;
                    this.uploadDisabled = true;
                })
                .catch(error => {
                    console.error(error);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: 'Error uploading attachment',
                            variant: 'error'
                        })
                    );
                });
        };
        reader.readAsDataURL(this.file);
    }
}