import { createLocalScope } from '../src'
import { shallowMount, mount } from '@vue/test-utils'

describe('createLocalScope', () => {
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

  it('works with v-slot', () => {
    const LocalScope = createLocalScope({
      foo: ({ foo, bar }) => foo.toUpperCase(),
      bar: ({ bar }) => bar,
      items: false,
      joined: ({ items }) => items.join(','),
    })

    const wrapper = mount({
      template: `<LocalScope :foo="foo" :bar="bar" :items="['one', 'two']" v-slot="{ foo, bar, joined }">
        <div>{{ foo }} {{ bar }}; {{ joined }}</div>
      </LocalScope>`,
      data: () => ({ foo: 'foo', bar: 'bar' }),
    }, {
      components: { LocalScope },
    })

    expect(wrapper.text()).toBe('FOO bar; one,two')
  })
})
