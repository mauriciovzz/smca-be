const checkAccessToken = require('./checkAccessToken');
const { checkReqParams, checkReqBody } = require('./checkRequestData');
const checkAccountId = require('./checkAccessToken');
const checkVerificationToken = require('./checkVerificationToken');
const checkSpaceId = require('./checkSpaceId');
const isRequesterSpaceAdmin = require('./isRequesterSpaceAdmin');
const isRequesterSpaceMember = require('./isRequesterSpaceMember');
const isSpaceMember = require('./isSpaceMember');
const isNotSelf = require('./isNotSelf');

module.exports = {
  checkAccessToken,
  checkReqParams,
  checkReqBody,
  checkAccountId,
  checkVerificationToken,
  checkSpaceId,
  isRequesterSpaceAdmin,
  isRequesterSpaceMember,
  isSpaceMember,
  isNotSelf,
};
