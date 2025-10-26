import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Article_Key {
  id: UUIDString;
  __typename?: 'Article_Key';
}

export interface CreateUserContentInteractionData {
  userContentInteraction_insert: UserContentInteraction_Key;
}

export interface CreateUserContentInteractionVariables {
  userId: UUIDString;
  articleId?: UUIDString | null;
  videoId?: UUIDString | null;
  interactionType: string;
}

export interface ListArticlesByAuthorData {
  articles: ({
    id: UUIDString;
    title: string;
    content: string;
    publishedDate: DateString;
  } & Article_Key)[];
}

export interface ListArticlesByAuthorVariables {
  author: string;
}

export interface ListVideosByTagData {
  videos: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    speaker: string;
    publishedDate: DateString;
  } & Video_Key)[];
}

export interface ListVideosByTagVariables {
  tag: string;
}

export interface Magazine_Key {
  id: UUIDString;
  __typename?: 'Magazine_Key';
}

export interface SubscribeToMagazineData {
  subscriptionType_insert: SubscriptionType_Key;
}

export interface SubscribeToMagazineVariables {
  magazineId: UUIDString;
  topic?: string | null;
}

export interface SubscriptionType_Key {
  id: UUIDString;
  __typename?: 'SubscriptionType_Key';
}

export interface UserContentInteraction_Key {
  id: UUIDString;
  __typename?: 'UserContentInteraction_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface Video_Key {
  id: UUIDString;
  __typename?: 'Video_Key';
}

interface CreateUserContentInteractionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserContentInteractionVariables): MutationRef<CreateUserContentInteractionData, CreateUserContentInteractionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserContentInteractionVariables): MutationRef<CreateUserContentInteractionData, CreateUserContentInteractionVariables>;
  operationName: string;
}
export const createUserContentInteractionRef: CreateUserContentInteractionRef;

export function createUserContentInteraction(vars: CreateUserContentInteractionVariables): MutationPromise<CreateUserContentInteractionData, CreateUserContentInteractionVariables>;
export function createUserContentInteraction(dc: DataConnect, vars: CreateUserContentInteractionVariables): MutationPromise<CreateUserContentInteractionData, CreateUserContentInteractionVariables>;

interface ListArticlesByAuthorRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListArticlesByAuthorVariables): QueryRef<ListArticlesByAuthorData, ListArticlesByAuthorVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListArticlesByAuthorVariables): QueryRef<ListArticlesByAuthorData, ListArticlesByAuthorVariables>;
  operationName: string;
}
export const listArticlesByAuthorRef: ListArticlesByAuthorRef;

export function listArticlesByAuthor(vars: ListArticlesByAuthorVariables): QueryPromise<ListArticlesByAuthorData, ListArticlesByAuthorVariables>;
export function listArticlesByAuthor(dc: DataConnect, vars: ListArticlesByAuthorVariables): QueryPromise<ListArticlesByAuthorData, ListArticlesByAuthorVariables>;

interface SubscribeToMagazineRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SubscribeToMagazineVariables): MutationRef<SubscribeToMagazineData, SubscribeToMagazineVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SubscribeToMagazineVariables): MutationRef<SubscribeToMagazineData, SubscribeToMagazineVariables>;
  operationName: string;
}
export const subscribeToMagazineRef: SubscribeToMagazineRef;

export function subscribeToMagazine(vars: SubscribeToMagazineVariables): MutationPromise<SubscribeToMagazineData, SubscribeToMagazineVariables>;
export function subscribeToMagazine(dc: DataConnect, vars: SubscribeToMagazineVariables): MutationPromise<SubscribeToMagazineData, SubscribeToMagazineVariables>;

interface ListVideosByTagRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListVideosByTagVariables): QueryRef<ListVideosByTagData, ListVideosByTagVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListVideosByTagVariables): QueryRef<ListVideosByTagData, ListVideosByTagVariables>;
  operationName: string;
}
export const listVideosByTagRef: ListVideosByTagRef;

export function listVideosByTag(vars: ListVideosByTagVariables): QueryPromise<ListVideosByTagData, ListVideosByTagVariables>;
export function listVideosByTag(dc: DataConnect, vars: ListVideosByTagVariables): QueryPromise<ListVideosByTagData, ListVideosByTagVariables>;

