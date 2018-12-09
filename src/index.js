export const LocalScope = {
  functional: true,
  render: (h, { data: { scopedSlots }, props }) => {
    return scopedSlots.default(props)
  },
}

export function createLocalScope (computed, propOptions = {}) {
  const keys = Object.keys(computed)
  const props = keys.reduce((props, key) => {
    props[key] = propOptions[key] || { required: true }
    return props
  }, {})

  return {
    props,
    computed: keys.reduce((transformedComputed, key) => {
      transformedComputed[key + '_'] = computed[key]
      return transformedComputed
    }, {}),
    render (h) {
      return this.$scopedSlots.default(
        keys.reduce((o, key) => {
          o[key] = this[key + '_']
          return o
        }, {})
      )
    },
  }
}
