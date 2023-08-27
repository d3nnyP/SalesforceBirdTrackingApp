import { LightningElement } from 'lwc'
import { wire } from 'lwc'
import getBird from '@salesforce/apex/BirdController.getBird'

export default class BirdImage extends LightningElement {
  birdImageMLCode

  @wire(getBird, { birdId: '$recordId' })
  wiredBird({ error, data }) {
    if (data) {
      this.birdImageMLCode = `https://macaulaylibrary.org/asset/${data.Macaulay_Library_Code__c}/embed`
    } else if (error) {
      console.error(error)
    }
  }
}
