# vue-local-scope [![Build Status](https://badgen.net/circleci/github/posva/vue-local-scope)](https://circleci.com/gh/posva/vue-local-scope) [![npm package](https://badgen.net/npm/v/vue-local-scope)](https://www.npmjs.com/package/vue-local-scope) [![coverage](https://badgen.net/codecov/c/github/posva/vue-local-scope)](https://codecov.io/github/posva/vue-local-scope) [![thanks](https://badgen.net/badge/thanks/♥/pink)](https://github.com/posva/thanks)

> 🖇 Generate local scopes in templates to compute data from other scoped slots

## Installation

```sh
npm install vue-local-scope
```

## Usage

Vue Local Scope exports two things:

- **LocalScope**: a functional component that pass down any prop into a scoped slot
- **createLocalScope** a function that returns a regular components with computed properties provided as a scoped slot

### LocalScope

LocalScope doesn't render any element by itself, it renders whatever is passed as a scoped slot. You can pass any prop to it, usually applying some kind of transformation, like a `map` or a `reduce`, **that transformation is only applied once everytime the template renders**, and it allows you to have a **local variable** based on anything that exists in the template. This is useful for data coming from a `slot-scope`:

```vue
<template>
  <div>
    <DataProvider>
    <template slot-scope="items">
      <LocalScope :names="items.map(i => i.name)" :ids="items.map(i => i.id)">
        <template slot-scope="{ names, ids }">
          <!-- we are able to use the mapped names three times but we only run map once -->
          <DisplayNames :names="names" @handle-change="updateNames(ids, names)" />
          <p>{{ names }}</p>
          <p>{{ ids }}</p>
        </template>
      </LocalScope>
    </template>
  </div>
</template>

<script>
import { LocalScope } from 'vue-local-scope'

export default {
  // other options
  components: { LocalScope }
}
</script>
```

Because `LocalScope` is a functional component, you can return any amount of elements but it will call `map` everytime something in the same template changes.

### `createLocalScope`

`createLocalScope` generates a stateful component and requires you to provide an object that maps props to new values. The generated component will use computed properties **to benefit from ther caching strategy** and give you back the data in a `scoped-slot`.

```vue
<template>
  <div>
    <DataProvider>
    <template slot-scope="{ items, others }">
      <NamesAndIdsScope :items="items" :others="others">
        <div slot-scope="{ names, ids, others }">
          <DisplayNames :names="names" @handle-change="updateNames(ids, names)" />
          <p>{{ names }}</p>
          <p>{{ ids }}</p>
          <p>{{ others }}</p>
        </div>
      </NamesAndIdsScope>
    </template>
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
  others: ({ others }) => others.filter(o => !o.skip)
})

export default {
  // other options
  components: { NamesAndIdsScope }
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
