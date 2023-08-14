public with sharing class BirdController {
  @AuraEnabled
  public static Id saveAttachment(
    Id parentId,
    String fileName,
    String contentType,
    String base64Data
  ) {
    Attachment attachment = new Attachment();
    attachment.ParentId = parentId;
    attachment.Name = fileName;
    attachment.ContentType = contentType;
    attachment.Body = EncodingUtil.base64Decode(base64Data);
    insert attachment;
    return attachment.Id;
  }
  @AuraEnabled(cacheable=true)
  public static Attachment getAttachment(Id parentId) {
    List<Attachment> attachments = [
      SELECT Id, ParentId
      FROM Attachment
      WHERE ParentId = :parentId
      LIMIT 1
    ];
    if (attachments.size() > 0) {
      return attachments[0];
    } else {
      return null;
    }
  }
  @AuraEnabled(cacheable=true)
  public static Bird__c getBird(Id birdId) {
    return [SELECT Id, Name FROM Bird__c WHERE Id = :birdId];
  }
}
