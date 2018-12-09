import { createLocalScope } from '../src'
import { shallowMount } from '@vue/test-utils'

describe('LocalScope', () => {
  it('works', () => {
    const LocalScope = createLocalScope({
      foo: ({ foo, bar }) => foo.toUpperCase(),
      bar: ({ bar }) => bar,
      items: false,
      joined: ({ items }) => items.join(','),
    })
    const wrapper = shallowMount(LocalScope, {
      propsData: {
        foo: 'foo',
        bar: 'bar',
        items: ['one', 'two'],
      },
      scopedSlots: {
        default: '<div>{{ props.foo }} {{ props.bar }}; {{ props.joined }}</div>',
      },
    })

    expect(wrapper.text()).toBe('FOO bar; one,two')
  })
})
