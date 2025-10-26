# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateUserContentInteraction, useListArticlesByAuthor, useSubscribeToMagazine, useListVideosByTag } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateUserContentInteraction(createUserContentInteractionVars);

const { data, isPending, isSuccess, isError, error } = useListArticlesByAuthor(listArticlesByAuthorVars);

const { data, isPending, isSuccess, isError, error } = useSubscribeToMagazine(subscribeToMagazineVars);

const { data, isPending, isSuccess, isError, error } = useListVideosByTag(listVideosByTagVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUserContentInteraction, listArticlesByAuthor, subscribeToMagazine, listVideosByTag } from '@dataconnect/generated';


// Operation CreateUserContentInteraction:  For variables, look at type CreateUserContentInteractionVars in ../index.d.ts
const { data } = await CreateUserContentInteraction(dataConnect, createUserContentInteractionVars);

// Operation ListArticlesByAuthor:  For variables, look at type ListArticlesByAuthorVars in ../index.d.ts
const { data } = await ListArticlesByAuthor(dataConnect, listArticlesByAuthorVars);

// Operation SubscribeToMagazine:  For variables, look at type SubscribeToMagazineVars in ../index.d.ts
const { data } = await SubscribeToMagazine(dataConnect, subscribeToMagazineVars);

// Operation ListVideosByTag:  For variables, look at type ListVideosByTagVars in ../index.d.ts
const { data } = await ListVideosByTag(dataConnect, listVideosByTagVars);


```