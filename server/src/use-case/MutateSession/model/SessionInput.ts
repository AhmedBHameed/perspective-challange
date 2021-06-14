export interface FieldInput {
  fieldName: string;
  label: string;
  value: any;
}

export interface SessionInput {
  timestamp: string;
  sentAt: string;
  properties: {
    trackingVersion: string;
    clientSessionId: string;
    clientPersistentId: string;
    pageId: string;
    companyId: string;
    campaignId: string;
    versionId: string;
    optIns: FieldInput[];
  };
  messageId: string;
}
