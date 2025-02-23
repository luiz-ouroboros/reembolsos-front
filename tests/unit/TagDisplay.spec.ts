import { mount } from '@vue/test-utils'
import TagDisplay from '../../src/components/TagDisplay.vue'
import { describe, it, expect } from 'vitest'

describe('TagDisplay.vue', () => {
  const tags = [
    { id: 1, name: 'Tag 1' },
    { id: 2, name: 'Tag 2' }
  ]

  it('renders tags', () => {
    const wrapper = mount(TagDisplay, {
      props: {
        tags,
        editable: false
      }
    })

    const tagSpans = wrapper.findAll('span')
    expect(tagSpans.length).toBe(tags.length)
    expect(tagSpans[0].text()).toContain('Tag 1')
    expect(tagSpans[1].text()).toContain('Tag 2')
  })

  it('shows remove button when editable is true', () => {
    const wrapper = mount(TagDisplay, {
      props: {
        tags,
        editable: true
      }
    })

    const removeButtons = wrapper.findAll('button')
    expect(removeButtons.length).toBe(tags.length)
  })

  it('does not show remove button when editable is false', () => {
    const wrapper = mount(TagDisplay, {
      props: {
        tags,
        editable: false
      }
    })

    const removeButtons = wrapper.findAll('button')
    expect(removeButtons.length).toBe(0)
  })

  it('emits tag-removed event when remove button is clicked', async () => {
    const wrapper = mount(TagDisplay, {
      props: {
        tags,
        editable: true
      }
    })

    const removeButton = wrapper.find('button')
    await removeButton.trigger('click')

    const emitted = wrapper.emitted('tag-removed')
    expect(emitted).toBeTruthy()
    expect(emitted?.length).toBe(1)
    expect(emitted?.[0]).toEqual([tags[0]])
  })
})
