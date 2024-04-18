/**
 * This DTO does not carry content of a file - it has all the data that is being stored within IpfsMetadata
 * Should be used for all API calls where content is not necessary
 */
export class IpfsMetadataDto {
  blake2b?: string;
  cid?: string;
  title?: string;
  contentType?: string;
  version?: string;
}
