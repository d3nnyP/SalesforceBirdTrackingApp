public class eBirdAPIService {
  @AuraEnabled
  public static String getRecentNotableBirdObservations(String regionCode) {
    Http http = new Http();
    HttpRequest request = new HttpRequest();
    request.setEndpoint(
      'callout:eBirdAPINamedCred/' +
        regionCode +
        '/recent/notable?detail=simple&maxResults=5&back=1'
    );
    request.setMethod('GET');

    try {
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
      // Log the exception
      System.debug('Exception occurred: ' + ex.getMessage());
      return null;
    }
  }
}
