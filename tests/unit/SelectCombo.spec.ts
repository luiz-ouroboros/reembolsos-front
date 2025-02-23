import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SelectCombo from '../../src/components/SelectCombo.vue'
import { nextTick } from 'vue'

const items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Outro Item' },
]

describe('SelectCombo.vue', () => {
  it('renderiza o label quando a prop label_prop é fornecida', () => {
    const wrapper = mount(SelectCombo, {
      props: {
        items,
        label_prop: 'Selecione um item',
      },
    })
    expect(wrapper.find('label').text()).toContain('Selecione um item')
  })

  it('mostra a lista de itens filtrados conforme o termo de busca', async () => {
    const wrapper = mount(SelectCombo, {
      props: {
        items,
        editable: true,
        key_prop: 'id',
        value_prop: 'name',
      },
    })

    const input = wrapper.find('input')
    await input.setValue('Item 2')
    await nextTick()

    // Aciona o keyup para garantir que o dropdown seja exibido
    await input.trigger('keyup')

    const dropdownItems = wrapper.findAll('ul li')
    expect(dropdownItems).toHaveLength(1)
    expect(dropdownItems[0].text()).toBe('Item 2')
  })

  it('emite "item-selected" quando um item é selecionado do dropdown', async () => {
    const wrapper = mount(SelectCombo, {
      props: {
        items,
        editable: true,
        key_prop: 'id',
        value_prop: 'name',
      },
    })

    const input = wrapper.find('input')
    await input.setValue('Item')
    await nextTick()
    await input.trigger('keyup')

    // Seleciona o primeiro item mostrado
    const firstDropdownItem = wrapper.find('ul li')
    await firstDropdownItem.trigger('mousedown')

    // Confirma que o evento foi emitido com o objeto correto
    expect(wrapper.emitted()['item-selected']).toBeTruthy()
    expect(wrapper.emitted()['item-selected'][0][0]).toEqual({ id: 1, name: 'Item 1' })
  })

  it('emite "item-cleared" ao limpar o campo', async () => {
    const wrapper = mount(SelectCombo, {
      props: {
        items,
        clearable: true,
        editable: true,
        key_prop: 'id',
        value_prop: 'name',
      },
    })

    const input = wrapper.find('input')
    await input.setValue('Item 1')
    await nextTick()

    // Clica no botão de limpar (x)
    const clearButton = wrapper.find('button')
    await clearButton.trigger('click')

    expect(wrapper.emitted()['item-cleared']).toBeTruthy()
    expect(wrapper.find('input').element.value).toBe('')
  })

  it('emite "item-createde" quando é informado um valor inexistente e isCreateble está habilitado', async () => {
    const wrapper = mount(SelectCombo, {
      props: {
        items,
        createble: true,
        editable: true,
        key_prop: 'id',
        value_prop: 'name',
      },
    })

    // Digita um valor que não corresponda a nenhum item
    const input = wrapper.find('input')
    await input.setValue('Novo Item')
    await nextTick()
    // Garante que o dropdown esteja visível
    await input.trigger('keyup')
    
    // Clica no botão de criação (+)
    const buttons = wrapper.findAll('button')
    // Identifica o botão de criação (o ícone '+' deve ser o último)
    const createButton = buttons[buttons.length - 1]
    await createButton.trigger('click')
    
    // Verifica se ocorreu emissão do evento de criação
    expect(wrapper.emitted()['item-createde']).toBeTruthy()
    expect(wrapper.emitted()['item-createde'][0][0]).toEqual({ name: 'Novo Item' })
  })
})
