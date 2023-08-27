public with sharing class BirdController {
  // called to return record Name field
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
}
