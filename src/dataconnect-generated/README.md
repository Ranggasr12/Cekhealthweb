# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListArticlesByAuthor*](#listarticlesbyauthor)
  - [*ListVideosByTag*](#listvideosbytag)
- [**Mutations**](#mutations)
  - [*CreateUserContentInteraction*](#createusercontentinteraction)
  - [*SubscribeToMagazine*](#subscribetomagazine)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListArticlesByAuthor
You can execute the `ListArticlesByAuthor` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listArticlesByAuthor(vars: ListArticlesByAuthorVariables): QueryPromise<ListArticlesByAuthorData, ListArticlesByAuthorVariables>;

interface ListArticlesByAuthorRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListArticlesByAuthorVariables): QueryRef<ListArticlesByAuthorData, ListArticlesByAuthorVariables>;
}
export const listArticlesByAuthorRef: ListArticlesByAuthorRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listArticlesByAuthor(dc: DataConnect, vars: ListArticlesByAuthorVariables): QueryPromise<ListArticlesByAuthorData, ListArticlesByAuthorVariables>;

interface ListArticlesByAuthorRef {
  ...
  (dc: DataConnect, vars: ListArticlesByAuthorVariables): QueryRef<ListArticlesByAuthorData, ListArticlesByAuthorVariables>;
}
export const listArticlesByAuthorRef: ListArticlesByAuthorRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listArticlesByAuthorRef:
```typescript
const name = listArticlesByAuthorRef.operationName;
console.log(name);
```

### Variables
The `ListArticlesByAuthor` query requires an argument of type `ListArticlesByAuthorVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListArticlesByAuthorVariables {
  author: string;
}
```
### Return Type
Recall that executing the `ListArticlesByAuthor` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListArticlesByAuthorData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListArticlesByAuthorData {
  articles: ({
    id: UUIDString;
    title: string;
    content: string;
    publishedDate: DateString;
  } & Article_Key)[];
}
```
### Using `ListArticlesByAuthor`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listArticlesByAuthor, ListArticlesByAuthorVariables } from '@dataconnect/generated';

// The `ListArticlesByAuthor` query requires an argument of type `ListArticlesByAuthorVariables`:
const listArticlesByAuthorVars: ListArticlesByAuthorVariables = {
  author: ..., 
};

// Call the `listArticlesByAuthor()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listArticlesByAuthor(listArticlesByAuthorVars);
// Variables can be defined inline as well.
const { data } = await listArticlesByAuthor({ author: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listArticlesByAuthor(dataConnect, listArticlesByAuthorVars);

console.log(data.articles);

// Or, you can use the `Promise` API.
listArticlesByAuthor(listArticlesByAuthorVars).then((response) => {
  const data = response.data;
  console.log(data.articles);
});
```

### Using `ListArticlesByAuthor`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listArticlesByAuthorRef, ListArticlesByAuthorVariables } from '@dataconnect/generated';

// The `ListArticlesByAuthor` query requires an argument of type `ListArticlesByAuthorVariables`:
const listArticlesByAuthorVars: ListArticlesByAuthorVariables = {
  author: ..., 
};

// Call the `listArticlesByAuthorRef()` function to get a reference to the query.
const ref = listArticlesByAuthorRef(listArticlesByAuthorVars);
// Variables can be defined inline as well.
const ref = listArticlesByAuthorRef({ author: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listArticlesByAuthorRef(dataConnect, listArticlesByAuthorVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.articles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.articles);
});
```

## ListVideosByTag
You can execute the `ListVideosByTag` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listVideosByTag(vars: ListVideosByTagVariables): QueryPromise<ListVideosByTagData, ListVideosByTagVariables>;

interface ListVideosByTagRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListVideosByTagVariables): QueryRef<ListVideosByTagData, ListVideosByTagVariables>;
}
export const listVideosByTagRef: ListVideosByTagRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listVideosByTag(dc: DataConnect, vars: ListVideosByTagVariables): QueryPromise<ListVideosByTagData, ListVideosByTagVariables>;

interface ListVideosByTagRef {
  ...
  (dc: DataConnect, vars: ListVideosByTagVariables): QueryRef<ListVideosByTagData, ListVideosByTagVariables>;
}
export const listVideosByTagRef: ListVideosByTagRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listVideosByTagRef:
```typescript
const name = listVideosByTagRef.operationName;
console.log(name);
```

### Variables
The `ListVideosByTag` query requires an argument of type `ListVideosByTagVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListVideosByTagVariables {
  tag: string;
}
```
### Return Type
Recall that executing the `ListVideosByTag` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListVideosByTagData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListVideosByTagData {
  videos: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    speaker: string;
    publishedDate: DateString;
  } & Video_Key)[];
}
```
### Using `ListVideosByTag`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listVideosByTag, ListVideosByTagVariables } from '@dataconnect/generated';

// The `ListVideosByTag` query requires an argument of type `ListVideosByTagVariables`:
const listVideosByTagVars: ListVideosByTagVariables = {
  tag: ..., 
};

// Call the `listVideosByTag()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listVideosByTag(listVideosByTagVars);
// Variables can be defined inline as well.
const { data } = await listVideosByTag({ tag: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listVideosByTag(dataConnect, listVideosByTagVars);

console.log(data.videos);

// Or, you can use the `Promise` API.
listVideosByTag(listVideosByTagVars).then((response) => {
  const data = response.data;
  console.log(data.videos);
});
```

### Using `ListVideosByTag`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listVideosByTagRef, ListVideosByTagVariables } from '@dataconnect/generated';

// The `ListVideosByTag` query requires an argument of type `ListVideosByTagVariables`:
const listVideosByTagVars: ListVideosByTagVariables = {
  tag: ..., 
};

// Call the `listVideosByTagRef()` function to get a reference to the query.
const ref = listVideosByTagRef(listVideosByTagVars);
// Variables can be defined inline as well.
const ref = listVideosByTagRef({ tag: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listVideosByTagRef(dataConnect, listVideosByTagVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.videos);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.videos);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUserContentInteraction
You can execute the `CreateUserContentInteraction` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUserContentInteraction(vars: CreateUserContentInteractionVariables): MutationPromise<CreateUserContentInteractionData, CreateUserContentInteractionVariables>;

interface CreateUserContentInteractionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserContentInteractionVariables): MutationRef<CreateUserContentInteractionData, CreateUserContentInteractionVariables>;
}
export const createUserContentInteractionRef: CreateUserContentInteractionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUserContentInteraction(dc: DataConnect, vars: CreateUserContentInteractionVariables): MutationPromise<CreateUserContentInteractionData, CreateUserContentInteractionVariables>;

interface CreateUserContentInteractionRef {
  ...
  (dc: DataConnect, vars: CreateUserContentInteractionVariables): MutationRef<CreateUserContentInteractionData, CreateUserContentInteractionVariables>;
}
export const createUserContentInteractionRef: CreateUserContentInteractionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserContentInteractionRef:
```typescript
const name = createUserContentInteractionRef.operationName;
console.log(name);
```

### Variables
The `CreateUserContentInteraction` mutation requires an argument of type `CreateUserContentInteractionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserContentInteractionVariables {
  userId: UUIDString;
  articleId?: UUIDString | null;
  videoId?: UUIDString | null;
  interactionType: string;
}
```
### Return Type
Recall that executing the `CreateUserContentInteraction` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserContentInteractionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserContentInteractionData {
  userContentInteraction_insert: UserContentInteraction_Key;
}
```
### Using `CreateUserContentInteraction`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUserContentInteraction, CreateUserContentInteractionVariables } from '@dataconnect/generated';

// The `CreateUserContentInteraction` mutation requires an argument of type `CreateUserContentInteractionVariables`:
const createUserContentInteractionVars: CreateUserContentInteractionVariables = {
  userId: ..., 
  articleId: ..., // optional
  videoId: ..., // optional
  interactionType: ..., 
};

// Call the `createUserContentInteraction()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUserContentInteraction(createUserContentInteractionVars);
// Variables can be defined inline as well.
const { data } = await createUserContentInteraction({ userId: ..., articleId: ..., videoId: ..., interactionType: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUserContentInteraction(dataConnect, createUserContentInteractionVars);

console.log(data.userContentInteraction_insert);

// Or, you can use the `Promise` API.
createUserContentInteraction(createUserContentInteractionVars).then((response) => {
  const data = response.data;
  console.log(data.userContentInteraction_insert);
});
```

### Using `CreateUserContentInteraction`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserContentInteractionRef, CreateUserContentInteractionVariables } from '@dataconnect/generated';

// The `CreateUserContentInteraction` mutation requires an argument of type `CreateUserContentInteractionVariables`:
const createUserContentInteractionVars: CreateUserContentInteractionVariables = {
  userId: ..., 
  articleId: ..., // optional
  videoId: ..., // optional
  interactionType: ..., 
};

// Call the `createUserContentInteractionRef()` function to get a reference to the mutation.
const ref = createUserContentInteractionRef(createUserContentInteractionVars);
// Variables can be defined inline as well.
const ref = createUserContentInteractionRef({ userId: ..., articleId: ..., videoId: ..., interactionType: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserContentInteractionRef(dataConnect, createUserContentInteractionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userContentInteraction_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userContentInteraction_insert);
});
```

## SubscribeToMagazine
You can execute the `SubscribeToMagazine` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
subscribeToMagazine(vars: SubscribeToMagazineVariables): MutationPromise<SubscribeToMagazineData, SubscribeToMagazineVariables>;

interface SubscribeToMagazineRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SubscribeToMagazineVariables): MutationRef<SubscribeToMagazineData, SubscribeToMagazineVariables>;
}
export const subscribeToMagazineRef: SubscribeToMagazineRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
subscribeToMagazine(dc: DataConnect, vars: SubscribeToMagazineVariables): MutationPromise<SubscribeToMagazineData, SubscribeToMagazineVariables>;

interface SubscribeToMagazineRef {
  ...
  (dc: DataConnect, vars: SubscribeToMagazineVariables): MutationRef<SubscribeToMagazineData, SubscribeToMagazineVariables>;
}
export const subscribeToMagazineRef: SubscribeToMagazineRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the subscribeToMagazineRef:
```typescript
const name = subscribeToMagazineRef.operationName;
console.log(name);
```

### Variables
The `SubscribeToMagazine` mutation requires an argument of type `SubscribeToMagazineVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SubscribeToMagazineVariables {
  magazineId: UUIDString;
  topic?: string | null;
}
```
### Return Type
Recall that executing the `SubscribeToMagazine` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SubscribeToMagazineData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SubscribeToMagazineData {
  subscriptionType_insert: SubscriptionType_Key;
}
```
### Using `SubscribeToMagazine`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, subscribeToMagazine, SubscribeToMagazineVariables } from '@dataconnect/generated';

// The `SubscribeToMagazine` mutation requires an argument of type `SubscribeToMagazineVariables`:
const subscribeToMagazineVars: SubscribeToMagazineVariables = {
  magazineId: ..., 
  topic: ..., // optional
};

// Call the `subscribeToMagazine()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await subscribeToMagazine(subscribeToMagazineVars);
// Variables can be defined inline as well.
const { data } = await subscribeToMagazine({ magazineId: ..., topic: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await subscribeToMagazine(dataConnect, subscribeToMagazineVars);

console.log(data.subscriptionType_insert);

// Or, you can use the `Promise` API.
subscribeToMagazine(subscribeToMagazineVars).then((response) => {
  const data = response.data;
  console.log(data.subscriptionType_insert);
});
```

### Using `SubscribeToMagazine`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, subscribeToMagazineRef, SubscribeToMagazineVariables } from '@dataconnect/generated';

// The `SubscribeToMagazine` mutation requires an argument of type `SubscribeToMagazineVariables`:
const subscribeToMagazineVars: SubscribeToMagazineVariables = {
  magazineId: ..., 
  topic: ..., // optional
};

// Call the `subscribeToMagazineRef()` function to get a reference to the mutation.
const ref = subscribeToMagazineRef(subscribeToMagazineVars);
// Variables can be defined inline as well.
const ref = subscribeToMagazineRef({ magazineId: ..., topic: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = subscribeToMagazineRef(dataConnect, subscribeToMagazineVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.subscriptionType_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.subscriptionType_insert);
});
```

