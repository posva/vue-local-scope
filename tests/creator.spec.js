import { createLocalScope } from '../src'
import { shallowMount } from '@vue/test-utils'

describe('LocalScope', () => {
  it('works', () => {
    const LocalScope = createLocalScope({
      foo: ({ foo, bar }) => foo.toUpperCase(),
      bar: ({ bar }) => bar,
    })
    const wrapper = shallowMount(LocalScope, {
      propsData: {
        foo: 'foo',
        bar: 'bar',
      },
      scopedSlots: {
        default: '<div>{{ props.foo }} {{ props.bar }}</div>',
      },
    })

    expect(wrapper.text()).toBe('FOO bar')
  })
})
