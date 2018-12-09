import { PropOptions } from 'vue'

/**
 * Creates a component with as many props as keys defined in computed. The generated component provides
 * a default scoped slot when you get back the same props provided to the component
 */
export declare function createLocalScope<
  Computed,
  Props = { [K in keyof Computed]: Computed[K] extends false ? never : PropOptions }
>(
  computed: Computed,
  propsOptions?: Props
): {
  props: Props
}
