import { LightningElement, track } from 'lwc';
import getRecentNotableBirdObservations from '@salesforce/apex/eBirdAPIService.getRecentNotableBirdObservations';

export default class eBirdApiComponent extends LightningElement {
    @track birdData;

    handleButtonClick() {
        const regionCode = 'US-CO'; // Replace with the region code you want to fetch data for

        getRecentNotableBirdObservations({ regionCode: regionCode })
            .then(result => {
                this.birdData = JSON.parse(result);
                console.log(this.birdData);
            })
            .catch(error => {
                console.log('error', error);
            });
    }
    handleClear() {
        this.birdData = [];
    }
}

