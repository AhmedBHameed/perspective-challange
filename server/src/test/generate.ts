// eslint-disable-next-line node/no-unpublished-import
import faker from 'faker';

/**
 * Faker functions for rapid access.
 */

// const genAmount = (): number => Math.trunc(Number(faker.finance.amount) * 100);
const genDate = faker.date.recent;
// const genEmail = faker.internet.email;
// const genPassword = faker.internet.password;
// const genName = faker.name.findName;
const genId = faker.datatype.uuid;
// const genNumber = faker.datatype.number;
// const genBoolean = faker.datatype.boolean;
// const genCountryName = faker.address.country;
// const genPhoneNumber = faker.phone.phoneNumber;
// const genNotes = faker.lorem.paragraph;
// const genTitle = faker.lorem.sentence;

const mockJobPayloadData = (attributes?: {pageId?: string; sentAt: string}) => ({
  timestamp: '2021-06-07T08:32:07.546Z',
  sentAt: attributes?.sentAt,
  properties: {
    trackingVersion: 'v3',
    clientSessionId: 'AFfmr1iGvkrJXxKWid9Ih',
    clientPersistentId: 'W3hi37-xp--9_pG1jkwIz',
    pageId: attributes?.pageId,
    companyId: '5fb4eb1a839d81001f800c22',
    campaignId: '609a878b0cba83001fb5abd2',
    versionId: '60a4c19fcf963b001f9f286e',
    optIns: [
      {
        fieldName: 'fullName',
        label: 'Full Name',
        value: 'Ahmed HAMEED',
      },
      {
        fieldName: 'email',
        label: 'Business Email',
        value: 'christoph@perspective.co',
      },
    ],
  },
  messageId: 'perspective-q6qmW8wlPgRwJo1JOB1Yz8',
});

export {mockJobPayloadData, genDate, genId};
