import sessionModel, {SessionModel} from '../../database/Session.model';
import {uniqBy} from 'lodash';
import {logger} from '../../services/Logger';
import {SessionInput} from './model/SessionInput';

const upsertMutateSessionData = async (data: SessionInput): Promise<SessionModel | Error> => {
  const {
    properties: {companyId, campaignId, versionId, optIns},
  } = data;

  try {
    const MutatedSession = await sessionModel.findOneAndUpdate(
      {companyId, campaignId, campaignVersionId: versionId},
      {
        profile: uniqBy(optIns, 'fieldName'),
        companyId,
        campaignId,
        campaignVersionId: versionId,
      },
      {upsert: true, new: true}
    );

    const result = await MutatedSession.save();
    return result;
  } catch (error) {
    logger.error('', error);
    return new Error(error.message);
  }
};

export default upsertMutateSessionData;
