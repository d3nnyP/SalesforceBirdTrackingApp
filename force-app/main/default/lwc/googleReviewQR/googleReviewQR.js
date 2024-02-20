import { LightningElement, wire, api } from 'lwc'
import getBird from '@salesforce/apex/BirdController.getBird'

export default class BirdImage extends LightningElement {
  @api recordId
  birdImageMLCode
  birdImageURL
  qrGenURL
  showImage = false

  @wire(getBird, { birdId: '$recordId' })
  wiredBird({ error, data }) {
    console.log('wiredBird', data, error)
    if (data) {
      this.birdImageMLCode = data.Macaulay_Library_Code__c
      this.birdImageURL = `https://macaulaylibrary.org/asset/${this.birdImageMLCode}`
      this.qrGenURL = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${this.birdImageURL}`
      this.showImage = true
    } else if (error) {
      console.error(error)
    }
  }
}
