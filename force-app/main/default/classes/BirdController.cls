public with sharing class BirdController {
  // called to return record Name field
  /**
   * Returns a Bird__c record with the specified birdId.
   * This method is annotated with @AuraEnabled(cacheable=true) to support client-side caching.
   *
   * @param birdId The ID of the Bird__c record to retrieve.
   * @return The Bird__c record with the specified birdId.
   */
  @AuraEnabled(cacheable=true)
  public static Bird__c getBird(Id birdId) {
    return [
      SELECT Id, Name, Macaulay_Library_Code__c
      FROM Bird__c
      WHERE Id = :birdId
    ];
  }
  // gets any file that is related to the record and returns the Id so it can be displayed
  @AuraEnabled(cacheable=true)
  public static Id getAttachment(Id parentId) {
    List<ContentDocumentLink> documentLinks = [
      SELECT ContentDocumentId
      FROM ContentDocumentLink
      WHERE LinkedEntityId = :parentId
      LIMIT 1
    ];

    if (documentLinks.size() > 0) {
      List<ContentVersion> contentVersions = [
        SELECT Id, ContentDocumentId, FileType, Title
        FROM ContentVersion
        WHERE ContentDocumentId = :documentLinks[0].ContentDocumentId
        LIMIT 1
      ];

      if (contentVersions.size() > 0) {
        return contentVersions[0].Id;
      }
    }
    return null;
  }
  @AuraEnabled(cacheable=true)
  public static Id getBirdOfTheDay() {
    List<Bird__c> birds = [SELECT Id FROM Bird__c];
    Integer birdCount = birds.size();
    System.debug('count' + birdCount);
    if (birdCount == 0) {
      return null;
    }
    Integer randomIndex = Integer.valueOf(
      Math.floor(Math.random() * birdCount)
    );
    System.debug('randomIndex' + randomIndex);
    System.debug('birdId' + birds[randomIndex].Id);
    return birds[randomIndex].Id;
  }

  @AuraEnabled(cacheable=true)
  public static Id getRandomRecord(String objectName) {
    String query = 'SELECT Id FROM ' + objectName;
    List<sObject> records = Database.query(query);
    Integer recordCount = records.size();
    System.debug('Record count: ' + recordCount);
    if (recordCount == 0) {
      return null;
    }
    Integer randomIndex = (Integer) (Math.floor(Math.random() * recordCount));
    System.debug('Random index: ' + randomIndex);
    System.debug('Record Id: ' + records[randomIndex].Id);
    return records[randomIndex].Id;
  }
}
