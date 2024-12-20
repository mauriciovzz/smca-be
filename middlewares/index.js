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
const checkNodeId = require('./checkNodeId');
const checkUserCredentials = require('./checkUserCredentials');
const checkVisibility = require('./checkVisibility');
const checkNodeVisibility = require('./checkNodeVisibility');
const checkNodeReadingsSpaceId = require('./checkNodeReadingsSpaceId');

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
  checkNodeId,
  checkUserCredentials,
  checkVisibility,
  checkNodeVisibility,
  checkNodeReadingsSpaceId,
};
