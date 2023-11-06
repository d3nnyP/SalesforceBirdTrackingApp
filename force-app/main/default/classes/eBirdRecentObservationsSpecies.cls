public with sharing class eBirdRecentObservationsSpecies {
  @AuraEnabled
  public static String getRecentObservations(String speciesCode) {
    try {
      Http http = new Http();
      HttpRequest request = new HttpRequest();
      request.setEndpoint(
        'callout:eBirdAPINamedCred/US/recent/' +
          speciesCode +
          '?maxResults=5&back=30&includeProvisional=true'
      );
      request.setMethod('GET');

      HttpResponse response = http.send(request);
      if (response.getStatusCode() == 200) {
        return response.getBody();
      } else {
        // Log the error response
        System.debug('API Error - Status Code: ' + response.getStatusCode());
        System.debug('API Error - Body: ' + response.getBody());
        return null;
      }
    } catch (Exception ex) {
      // Handle any exceptions or errors
      System.debug('Error fetching eBird observations: ' + ex.getMessage());
      return null;
    }
  }
}
