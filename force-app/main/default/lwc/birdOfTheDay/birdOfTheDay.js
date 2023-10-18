import { LightningElement, wire } from 'lwc'
import { getRecord } from 'lightning/uiRecordApi'
import { NavigationMixin } from 'lightning/navigation'
import getRandomRecord from '@salesforce/apex/BirdController.getRandomRecord'

// This class represents the bird of the day component
export default class BirdOfTheDay extends NavigationMixin(LightningElement) {
  birdOfTheDay
  error
  birdName
  macaulayLibraryCode
  date
  recordId
  birdImageUrl = `https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${this.macaulayLibraryCode}`

  // This function is called when the component is initialized
  connectedCallback() {
    const storedDate = localStorage.getItem('date')
    const storedBirdName = localStorage.getItem('birdName')
    const storedMacaulayLibraryCode = localStorage.getItem(
      'macaulayLibraryCode',
    )
    const storedRecordId = localStorage.getItem('recordId')
    const today = new Date()
    const todayOptions = { month: 'short', day: '2-digit', year: 'numeric' }
    const formattedDate = today.toLocaleDateString('en-US', todayOptions)
    if (storedDate && storedDate === formattedDate) {
      this.date = storedDate
      this.birdName = storedBirdName
      this.macaulayLibraryCode = storedMacaulayLibraryCode
      this.recordId = storedRecordId
    } else {
      this.refreshBirdOfTheDay()
      this.date = formattedDate
    }
  }

  refreshBirdOfTheDay() {
    getRandomRecord({ objectName: 'Bird__c' })
      .then((result) => {
        this.birdOfTheDay = result
        this.error = undefined
      })
      .catch((error) => {
        this.error = error
        this.birdOfTheDay = undefined
      })
    const date = new Date()
    const options = { month: 'short', day: '2-digit', year: 'numeric' }
    const formattedDate = date.toLocaleDateString('en-US', options)
    this.date = formattedDate
    localStorage.setItem('date', this.date)
  }

  @wire(getRecord, {
    recordId: '$birdOfTheDay',
    fields: ['Bird__c.Id', 'Bird__c.Name', 'Bird__c.Macaulay_Library_Code__c'],
  })
  bird({ error, data }) {
    if (data) {
      this.birdName = data.fields.Name.value
      this.macaulayLibraryCode = data.fields.Macaulay_Library_Code__c.value
      this.recordId = data.fields.Id.value
      localStorage.setItem('birdName', this.birdName)
      localStorage.setItem('macaulayLibraryCode', this.macaulayLibraryCode)
      localStorage.setItem('recordId', this.recordId)
    } else if (error) {
      console.log('Error fetching bird:', error)
    }
  }

  navigateToRecordPage() {
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: this.recordId,
        actionName: 'view',
      },
    })
    console.log('running: ', this.recordId)
  }

  get birdImage() {
    return `https://cdn.download.ams.birds.cornell.edu/api/v1/asset/${this.macaulayLibraryCode}`
  }
}
