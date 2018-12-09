export const LocalScope = {
  functional: true,
  render: (h, { data: { scopedSlots }, props }) => {
    return scopedSlots.default(props)
  },
}

export function createLocalScope (computed, propOptions = {}) {
  const propsKeys = Object.keys(computed)
  // remove values that are prop only
  const computedKeys = Object.keys(computed).filter(k => computed[k])
  const props = propsKeys.reduce((props, key) => {
    // mark the prop as required by default if it's false as it doesn't generate
    // a computed property
    props[key] = propOptions[key] || { required: !computed[key] }
    return props
  }, {})

  return {
    props,
    computed: computedKeys.reduce((transformedComputed, key) => {
      transformedComputed[key + '_'] = computed[key]
      return transformedComputed
    }, {}),
    render (h) {
      return this.$scopedSlots.default(
        computedKeys.reduce((o, key) => {
          o[key] = this[key + '_']
          return o
        }, {})
      )
    },
  }
}
