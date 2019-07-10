import { LocalScope } from '../src'
import { shallowMount, mount } from '@vue/test-utils'

describe('LocalScope', () => {
  it('works', () => {
    const wrapper = shallowMount(LocalScope, {
      // see https://github.com/vuejs/vue-test-utils/issues/918
      context: {
        props: {
          foo: 'foo',
          bar: 'bar',
        },
      },
      scopedSlots: {
        default: '<div>{{ props.foo }} {{ props.bar }}</div>',
      },
    })

    expect(wrapper.text()).toBe('foo bar')
  })

  it('works with v-slot', () => {
    const wrapper = mount({
      template: `<LocalScope foo="foo" bar="bar" v-slot="{ foo, bar }">
        <div>{{ foo }} {{ bar }}</div>
      </LocalScope>`,
    }, {
      components: { LocalScope },
    })

    expect(wrapper.text()).toBe('foo bar')
  })
})
