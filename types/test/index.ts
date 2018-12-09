import { createLocalScope } from '../'

let comp = createLocalScope({
  foo: ({ foo }: { foo: string }) => foo.toUpperCase(),
  items: false,
})
comp.props.foo
