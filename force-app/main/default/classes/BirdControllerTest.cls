@isTest
public class BirdControllerTest {
  @isTest
  static void testGetBird() {
    // Create a test bird record
    Bird__c testBird = new Bird__c(Name = 'Test Bird');
    insert testBird;

    // Call the getBird() method with the test bird record ID
    Bird__c result = BirdController.getBird(testBird.Id);

    // Verify that the method returns the correct bird record
    System.assertEquals(testBird.Id, result.Id);
    System.assertEquals(testBird.Name, result.Name);
  }
  @isTest
  static void testGetAttachment() {
    // Create a test bird record
    Bird__c testBird = new Bird__c(Name = 'Test Bird');
    insert testBird;

    // Create a test attachment
    ContentVersion testAttachment = new ContentVersion(
      Title = 'Test Attachment',
      PathOnClient = 'test.txt',
      VersionData = Blob.valueOf('Test Attachment Data')
    );
    insert testAttachment;

    // Query for the ContentDocumentId of the ContentVersion record
    testAttachment = [
      SELECT ContentDocumentId
      FROM ContentVersion
      WHERE Id = :testAttachment.Id
    ];

    System.debug('ContentVersion record: ' + testAttachment);

    // Create a test content document link
    ContentDocumentLink testLink = new ContentDocumentLink(
      LinkedEntityId = testBird.Id,
      ContentDocumentId = testAttachment.ContentDocumentId,
      ShareType = 'V'
    );

    System.debug('ContentDocumentLink record: ' + testLink);

    insert testLink;

    // Call the getAttachment() method with the test bird record ID
    Id result = BirdController.getAttachment(testBird.Id);

    // Verify that the method returns the correct attachment ID
    System.assertEquals(testAttachment.Id, result);
  }
}
