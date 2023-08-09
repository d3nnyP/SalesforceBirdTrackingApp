import { LightningElement, api, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getRecentObservations from '@salesforce/apex/eBirdRecentObservationsSpecies.getRecentObservations';



export default class RecentObservations extends LightningElement {
    @api recordId; // Bird record Id passed to the component
    @track speciesCode;
    @track birdName;
    @track birdData;


    @wire(getRecord, { recordId: '$recordId', fields: ['Bird__c.Name', 'Bird__c.eBird_Species_Code__c'] })
    birdRecord({ error, data }) {
        if (data) {
            // Get the species name and species code from the Bird object's fields
            this.birdName = data.fields.Name.value;
            this.speciesCode = data.fields.eBird_Species_Code__c.value;
        } else if (error) {
            console.log('Error fetching Bird record:', error);
        }
    }

    handleButtonClick() {
        // if (!this.speciesCode) {
        //     // If the species code is not available, do not proceed with the API call
        //     return;
        // }
        const speciesCode = this.speciesCode;

        // Call the Apex method to fetch recent observations
        getRecentObservations({ speciesCode: speciesCode })
            .then(result => {
                this.birdData = JSON.parse(result).map(observation => {
            // Format the observation date using the user's locale
                observation.obsDt = new Date(observation.obsDt).toLocaleDateString();
                return observation;
            });
         })
            .catch(error => {
                console.log('Error fetching eBird observations:', error);
            });
    }

    handleClear() {
        this.birdData = [];
    }

}