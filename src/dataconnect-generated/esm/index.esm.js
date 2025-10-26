import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'cekhealthweb',
  location: 'us-east4'
};

export const createUserContentInteractionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUserContentInteraction', inputVars);
}
createUserContentInteractionRef.operationName = 'CreateUserContentInteraction';

export function createUserContentInteraction(dcOrVars, vars) {
  return executeMutation(createUserContentInteractionRef(dcOrVars, vars));
}

export const listArticlesByAuthorRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListArticlesByAuthor', inputVars);
}
listArticlesByAuthorRef.operationName = 'ListArticlesByAuthor';

export function listArticlesByAuthor(dcOrVars, vars) {
  return executeQuery(listArticlesByAuthorRef(dcOrVars, vars));
}

export const subscribeToMagazineRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SubscribeToMagazine', inputVars);
}
subscribeToMagazineRef.operationName = 'SubscribeToMagazine';

export function subscribeToMagazine(dcOrVars, vars) {
  return executeMutation(subscribeToMagazineRef(dcOrVars, vars));
}

export const listVideosByTagRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListVideosByTag', inputVars);
}
listVideosByTagRef.operationName = 'ListVideosByTag';

export function listVideosByTag(dcOrVars, vars) {
  return executeQuery(listVideosByTagRef(dcOrVars, vars));
}

