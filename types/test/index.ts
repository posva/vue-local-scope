import { createLocalScope } from '../'

let comp = createLocalScope({ foo: ({ foo }: { foo: string }) => foo.toUpperCase() })
comp.props.foo
