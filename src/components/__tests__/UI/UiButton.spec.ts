import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import UiButton from '../../UI/UiButton.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(UiButton, { props: { text: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
