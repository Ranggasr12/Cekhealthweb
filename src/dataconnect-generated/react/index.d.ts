import { CreateUserContentInteractionData, CreateUserContentInteractionVariables, ListArticlesByAuthorData, ListArticlesByAuthorVariables, SubscribeToMagazineData, SubscribeToMagazineVariables, ListVideosByTagData, ListVideosByTagVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUserContentInteraction(options?: useDataConnectMutationOptions<CreateUserContentInteractionData, FirebaseError, CreateUserContentInteractionVariables>): UseDataConnectMutationResult<CreateUserContentInteractionData, CreateUserContentInteractionVariables>;
export function useCreateUserContentInteraction(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserContentInteractionData, FirebaseError, CreateUserContentInteractionVariables>): UseDataConnectMutationResult<CreateUserContentInteractionData, CreateUserContentInteractionVariables>;

export function useListArticlesByAuthor(vars: ListArticlesByAuthorVariables, options?: useDataConnectQueryOptions<ListArticlesByAuthorData>): UseDataConnectQueryResult<ListArticlesByAuthorData, ListArticlesByAuthorVariables>;
export function useListArticlesByAuthor(dc: DataConnect, vars: ListArticlesByAuthorVariables, options?: useDataConnectQueryOptions<ListArticlesByAuthorData>): UseDataConnectQueryResult<ListArticlesByAuthorData, ListArticlesByAuthorVariables>;

export function useSubscribeToMagazine(options?: useDataConnectMutationOptions<SubscribeToMagazineData, FirebaseError, SubscribeToMagazineVariables>): UseDataConnectMutationResult<SubscribeToMagazineData, SubscribeToMagazineVariables>;
export function useSubscribeToMagazine(dc: DataConnect, options?: useDataConnectMutationOptions<SubscribeToMagazineData, FirebaseError, SubscribeToMagazineVariables>): UseDataConnectMutationResult<SubscribeToMagazineData, SubscribeToMagazineVariables>;

export function useListVideosByTag(vars: ListVideosByTagVariables, options?: useDataConnectQueryOptions<ListVideosByTagData>): UseDataConnectQueryResult<ListVideosByTagData, ListVideosByTagVariables>;
export function useListVideosByTag(dc: DataConnect, vars: ListVideosByTagVariables, options?: useDataConnectQueryOptions<ListVideosByTagData>): UseDataConnectQueryResult<ListVideosByTagData, ListVideosByTagVariables>;
