import { LightningElement, wire, api } from 'lwc'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import getAttachment from '@salesforce/apex/BirdController.getAttachment'
import getBird from '@salesforce/apex/BirdController.getBird'
import { refreshApex } from '@salesforce/apex'

export default class BirdImageUpload extends LightningElement {
  @api recordId
  imageUrl
  file
  birdName
  wiredBirdImage

  // file formats for lightning-file-upload
  get acceptedFormats() {
    return ['.jpg', '.jpeg', '.png']
  }

  // get record name to display
  @wire(getBird, { birdId: '$recordId' })
  wiredBird({ error, data }) {
    console.log('wiredBird2', data, error)
    if (data) {
      this.birdName = data.Name
      console.log(this.recordId)
    } else if (error) {
      console.error(error)
    }
  }

  // checks to see if there is an image already attached to the record and sets it to the image url
  @wire(getAttachment, { parentId: '$recordId' })
  wiredAttachment(wireResult) {
    const { data, error } = wireResult
    this.wiredBirdImage = wireResult
    if (data) {
      this.imageUrl = '/sfc/servlet.shepherd/version/download/' + data
      console.log('this.imageUrl: ' + this.imageUrl)
    } else if (error) {
      console.error(error)
    }
  }

  // fires when file is uploaded
  handleUploadFinished(event) {
    const uploadedFiles = event.detail.files
    console.log('uploadedFiles: ' + JSON.stringify(uploadedFiles))
    const successMessage = new ShowToastEvent({
      title: 'Success!',
      message: 'Bird image uploaded successfully.',
    })
    this.dispatchEvent(successMessage)

    return refreshApex(this.wiredBirdImage)
  }
}
