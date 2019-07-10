# vue-local-scope [![Build Status](https://badgen.net/circleci/github/posva/vue-local-scope)](https://circleci.com/gh/posva/vue-local-scope) [![npm package](https://badgen.net/npm/v/vue-local-scope)](https://www.npmjs.com/package/vue-local-scope) [![coverage](https://badgen.net/codecov/c/github/posva/vue-local-scope)](https://codecov.io/github/posva/vue-local-scope) [![thanks](https://badgen.net/badge/thanks/♥/pink)](https://github.com/posva/thanks)

> 🖇 Generate local scopes in templates to compute data from other scoped slots

## Installation

```sh
npm install vue-local-scope
```

## Why?

When using [scoped slots](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) you often get access to data only in the template. But sometimes, you still need to apply transformation to that data, like calling a `map` on an array or a `filter`. Here is an example using [Vue Promised](https://github.com/posva/vue-promised) to fetch information from an API endpoint:

```vue
<template>
  <Promised :promise="usersPromise">
    <div slot-scope="users">
      <Autocomplete v-model="selectedUsers" :items="users.map(user => ({ value: user.id, label: user.name })) /">
      <SelectedUsers :users="selectedUsers.map(user => users.find(u => u.id === user.value))" />
    </div>
  </Promised>
</template>
```

This approach has multiple issues:

- The `map` functions are called everytime the component renders even if the array `users` didn't change
- If you need the mapped version of `users` in multiple places you will duplicate the code and calls of `map`
- There is too much code written in the template, it should definitely go in the `script` section

Vue Local Scope solve these problems with components and scoped slots.

## Usage

Vue Local Scope exports two things:

- **LocalScope**: a functional component that pass down any prop into a scoped slot
- **createLocalScope** a function that returns a regular components with computed properties provided as a scoped slot

### LocalScope

LocalScope doesn't generate any DOM node by itself, it renders whatever is passed as a scoped slot. It allows you to not duplicate your code but still present the first and third problem discussed in the [Why](#Why) section. You can pass any prop to it, usually applying some kind of transformation, like a `map` or a `reduce`, **that transformation is only applied once everytime the template renders**, and it allows you to have a **local variable** based on anything that exists in the template. This is useful for data coming from a `slot-scope`:

```vue
<template>
  <div>
    <DataProvider>
      <template slot-scope="items">
        <LocalScope
          :names="items.map(i => i.name)"
          :ids="items.map(i => i.id)"
          v-slot="{ names, ids }"
        >
          <!-- we are able to use the mapped names three times but we only run map once -->
          <DisplayNames :names="names" @handle-change="updateNames(ids, names)" />
          <p>{{ names }}</p>
          <p>{{ ids }}</p>
        </LocalScope>
      </template>
    </DataProvider>
  </div>
</template>

<script>
import { LocalScope } from 'vue-local-scope'

export default {
  // other options
  components: { LocalScope },
}
</script>
```

Because `LocalScope` is a functional component, you can return any amount of elements but it will call `map` everytime something in the same template changes.

### `createLocalScope`

`createLocalScope` is a function that generates a component to hold computed properties and provide them in a scoped slot. It is less convenient than LocalScope but because it generates a stateful component **it benefits from caching in computed properties**. It also exposes the data through a scoped slot:

```vue
<template>
  <div>
    <DataProvider>
      <template slot-scope="{ items, others }">
        <!-- Here we are intentionally using the same variable name `others` to shadow the variable inside NamesAndIdsScope -->
        <NamesAndIdsScope :items="items" :others="others" v-slot="{ name, ids, others }">
          <DisplayNames :names="names" @handle-change="updateNames(ids, names)" />
          <p>{{ names }}</p>
          <p>{{ ids }}</p>
          <p>{{ others }}</p>
        </NamesAndIdsScope>
      </template>
    </DataProvider>
  </div>
</template>

<script>
import { createLocalScope } from 'vue-local-scope'

const NamesAndIdsScope = createLocalScope({
  names: ({ items }) => items.map(i => i.name),
  ids: ({ items }) => items.map(i => i.id),
  // we don't need to transform items but we need it as a prop
  items: false,
  // we can also override a value directly
  // others is a prop and will appear in the `slot-scope` as `others`
  others: ({ others }) => others.filter(o => !o.skip),
})

export default {
  // other options
  components: { NamesAndIdsScope },
}
</script>
```

In this case we do get the benefit from computed properties caching but we need to provide a root element (the `div` with the `slot-scope`)

## API

### `createLocalScope(computed, propsOptions?): Component`

- `computed`: object of transformations applied to props
- `propsOptions` optional object to define `propOptions` for each key in `computed`

## Related

- [vue-promised](https://github.com/posva/vue-promised)

## License

[MIT](http://opensource.org/licenses/MIT)
