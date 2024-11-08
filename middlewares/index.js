const checkAccessToken = require('./checkAccessToken');
const { checkReqParams, checkReqBody } = require('./checkRequestData');
const checkAccountId = require('./checkAccountId');
const checkVerificationToken = require('./checkVerificationToken');
const checkSpaceId = require('./checkSpaceId');
const isRequesterSpaceAdmin = require('./isRequesterSpaceAdmin');
const isRequesterSpaceMember = require('./isRequesterSpaceMember');
const checkMemberId = require('./checkMemberId');
const checkLocationId = require('./checkLocationId');
const checkVariableId = require('./checkVariableId');
const checkComponentId = require('./checkComponentId');

module.exports = {
  checkAccessToken,
  checkReqParams,
  checkReqBody,
  checkAccountId,
  checkVerificationToken,
  checkSpaceId,
  isRequesterSpaceAdmin,
  isRequesterSpaceMember,
  checkMemberId,
  checkLocationId,
  checkVariableId,
  checkComponentId,
};
