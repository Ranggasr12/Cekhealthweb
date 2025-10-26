const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'cekhealthweb',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createUserContentInteractionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUserContentInteraction', inputVars);
}
createUserContentInteractionRef.operationName = 'CreateUserContentInteraction';
exports.createUserContentInteractionRef = createUserContentInteractionRef;

exports.createUserContentInteraction = function createUserContentInteraction(dcOrVars, vars) {
  return executeMutation(createUserContentInteractionRef(dcOrVars, vars));
};

const listArticlesByAuthorRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListArticlesByAuthor', inputVars);
}
listArticlesByAuthorRef.operationName = 'ListArticlesByAuthor';
exports.listArticlesByAuthorRef = listArticlesByAuthorRef;

exports.listArticlesByAuthor = function listArticlesByAuthor(dcOrVars, vars) {
  return executeQuery(listArticlesByAuthorRef(dcOrVars, vars));
};

const subscribeToMagazineRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SubscribeToMagazine', inputVars);
}
subscribeToMagazineRef.operationName = 'SubscribeToMagazine';
exports.subscribeToMagazineRef = subscribeToMagazineRef;

exports.subscribeToMagazine = function subscribeToMagazine(dcOrVars, vars) {
  return executeMutation(subscribeToMagazineRef(dcOrVars, vars));
};

const listVideosByTagRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListVideosByTag', inputVars);
}
listVideosByTagRef.operationName = 'ListVideosByTag';
exports.listVideosByTagRef = listVideosByTagRef;

exports.listVideosByTag = function listVideosByTag(dcOrVars, vars) {
  return executeQuery(listVideosByTagRef(dcOrVars, vars));
};
