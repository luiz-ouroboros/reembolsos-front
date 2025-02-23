<template>
  <div class="bg-white p-4 rounded-lg shadow-md cursor-pointer" @click="toggleExpanded">
    <div class="flex justify-between">
      <h2 class="text-lg font-bold text-red-600">{{ props.refundRequest.status }}</h2>
      <h2 v-if="store.state.user.role === 'admin'" class="text-lg font-bold text-gray-400">{{ props.refundRequest.user.name || props.refundRequest.user.email }}</h2>
    </div>
    <div v-show="!editingRefund.isExpanded" class="flex justify-between">
      <p v-show="editingRefund.description" class="text-gray-700 mt-2">{{ editingRefund.description }}</p>
      <p v-show="editingRefund.total" class="text-gray-700 mt-2">R$ {{ editingRefund.total }}</p>
    </div>
    <div v-if="!editingRefund.isExpanded" class="mt-2">
      <TagDisplay
        v-if="editingRefund.tags"
        :tags="editingRefund.tags"
        :editable="canUpdate()"
        @tag-removed="removeTag()"
      />
    </div>

    <transition name="expand">
      <div v-if="editingRefund.isExpanded" class="mt-4 space-y-4" @click.stop>
        <div>
          <label for="description" class="block font-medium text-gray-700">Descrição</label>
          <input
            id="description"
            type="text"
            :readonly="!canUpdate()"
            v-model="editingRefund.description"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            required
          />
          <div v-if="v$.description.$error" class="text-red-500 text-sm">
            <span v-if="v$.description.$errors.find(e => e.$validator === 'required')">Descrição é obrigatória.</span>
          </div>
        </div>
        <div>
          <label for="total" class="block font-medium text-gray-700">Total</label>
          <input
            id="total"
            type="number"
            :readonly="!canUpdate()"
            v-model.number="editingRefund.total"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            required
          />
          <div v-if="v$.total.$error" class="text-red-500 text-sm">
            <span v-if="v$.total.$errors.find(e => e.$validator === 'required')">Total é obrigatório.</span>
            <span v-else-if="v$.total.$errors.find(e => e.$validator === 'numeric')">Total deve ser numérico.</span>
            <span v-else-if="v$.total.$errors.find(e => e.$validator === 'minValue')">Total deve ser maior ou igual a 0.</span>
          </div>
        </div>
        <div>
          <label for="paid_at" class="block font-medium text-gray-700">Pago Em</label>
          <input
            id="paid_at"
            type="date"
            :readonly="!canUpdate()"
            v-model="editingRefund.paid_at"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            required
          />
          <div v-if="v$.paid_at.$error" class="text-red-500 text-sm">
            <span v-if="v$.paid_at.$errors.find(e => e.$validator === 'required')">Data de pagamento é obrigatória.</span>
          </div>
        </div>
        <div>
          <SelectCombo
            :items="store.state.suppliers"
            :selected_item="editingRefund.supplier"
            :editable="canUpdate()"
            :createble="canUpdate()"
            :clearable="canUpdate()"
            :validator="v$.supplier_id"
            inputClass="focus:ring-red-500 focus:border-red-500"
            label_prop="Fornecedor"
            @item-selected="supplierSelectedFromCombo"
            @item-createde="createSupplierFromCombo"
            @item-cleared="supplierClearFromCombo"
          />
        </div>
        <div>
          <label for="tag-search" class="block font-medium text-gray-700">Tags</label>
          <TagDisplay
            v-if="editingRefund.tags"
            :tags="editingRefund.tags"
            :editable="canUpdate()"
            @tag-removed="removeTag()"
          />
          <SelectCombo
            v-if="canUpdate()"
            :items="store.state.tags"
            :editable="canUpdate()"
            :createble="canUpdate()"
            :clearable="canUpdate()"
            :validator="v$.tags"
            inputClass="focus:ring-red-500 focus:border-red-500"
            @item-selected="handleTagSelected"
            @item-createde="createTagFromCombo"
          />
        </div>
        <div v-if="canUpdate() || canApprove()" class="flex justify-between mt-4">
          <button v-if="canUpdate()" @click="destroy" type="button" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
            Excluir
          </button>
          <div v-if="canUpdate()">
            <button @click="saveChanges" type="button" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mr-2">
              Salvar
            </button>
            <button @click="sendForApproval" type="button" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
              Enviar
            </button>
          </div>
          <button v-if="canApprove()" @click="reprove" type="button" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
            Reprovar
          </button>
          <button v-if="canApprove()" @click="approve" type="button" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
            Aprovar
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import TagDisplay from './TagDisplay.vue'
import SelectCombo from './SelectCombo.vue'
import useVuelidate from '@vuelidate/core'
import { required, numeric, minValue } from '@vuelidate/validators'

interface RefundRequest {
  id: number;
  description?: string;
  total?: number;
  paid_at?: string;
  status: string;
  updated_by?: string;
  approved_by?: string;
  requested_at?: string;
  approved_at?: string;
  reimpursed_at?: string;
  latitude?: number;
  longitude?: number;
  supplier_id?: number;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
  tag_ids?: number[];
  user?: { id: number; email: string; name?: string };
  supplier?: { id: number; name: string };
  tags?: { id: number; name: string }[];
  isExpanded?: boolean;
}

const props = defineProps<{
  refundRequest: RefundRequest;
}>()

const store = useStore();

const editingRefund = ref(
  store.state.refundRequests.find(
    (refund: RefundRequest) => refund.id === props.refundRequest.id
  )
)

onMounted(() => {
  if (!editingRefund.value.paid_at) {
    editingRefund.value.paid_at = new Date().toISOString().split('T')[0]
  }
})

const rules = {
  description: { required },
  total: { required, numeric, minValue: minValue(0) },
  paid_at: { required },
  supplier_id: { required },
  tags: { required }
}
const v$ = useVuelidate(rules, editingRefund.value)

function canApprove() {
  return editingRefund.value.status === 'requested' && store.state.user.role === 'admin'
}

function canUpdate() {
  return ['draft', 'reproved'].includes(editingRefund.value.status) && editingRefund.value.user_id === store.state.user.id
}

function saveChanges() {
  v$.value.$touch()
  if (v$.value.$invalid) return
  update(editingRefund.value)
}

function sendForApproval() {
  v$.value.$touch()
  if (v$.value.$invalid) return
  update({ ...editingRefund.value, status: 'requested' })
    .then(() => editingRefund.value.isExpanded = false)
}

function approve() {
  update({ status: 'approved' })
    .then(() => editingRefund.value.isExpanded = false)
}

function reprove() {
  update({ status: 'reproved' })
    .then(() => editingRefund.value.isExpanded = false)
}

function update(payload: object) {
  return store.dispatch('updateRefundRequest', { id: editingRefund.value.id, payload })
}

function destroy() {
  store.dispatch('destroyRefundRequest', editingRefund.value.id)
    .then(() => editingRefund.value.isExpanded = false)
}

function supplierSelectedFromCombo(supplier: any) {
  editingRefund.value.supplier_id = supplier.id
}

function supplierClearFromCombo() {
  editingRefund.value.supplier_id = null
}

function createSupplierFromCombo(item) {
  store.dispatch('createSupplier',item)
    .then((response: any) => {
      store.dispatch('loadSuppliers')
      if (response && response.data && response.data.id) {
        editingRefund.value.supplier_id = response.data.id;
      }
    })
    .catch((error: any) => {
      console.error(error);
    });
}

function handleTagSelected(tag) {
  if (!editingRefund.value.tag_ids) editingRefund.value.tag_ids = [];
  if (!editingRefund.value.tags) editingRefund.value.tags = [];
  if (!editingRefund.value.tag_ids.includes(tag.id)) {
    editingRefund.value.tag_ids.push(tag.id);
    editingRefund.value.tags.push(tag);
  }
}

function createTagFromCombo(tag) {
  store
    .dispatch('createTag', tag)
    .then((response: any) => {
      store.dispatch('loadTags');
      if (response && response.data && response.data.id) {
        if (!editingRefund.value.tag_ids) editingRefund.value.tag_ids = [];
        editingRefund.value.tag_ids.push(response.data.id);
        editingRefund.value.tags.push(response.data);
      }
    })
    .catch((error: any) => {
      console.error(error);
    });
}

function removeTag(tag) {
  if (canUpdate()) {
    if (editingRefund.value.tag_ids) {
      const idx = editingRefund.value.tag_ids.indexOf(tag.id);
      if (idx > -1) {
        editingRefund.value.tag_ids.splice(idx, 1);
        editingRefund.value.tags.splice(idx, 1)
      }
    }
  }
}

function toggleExpanded() {
  editingRefund.value.isExpanded = !editingRefund.value.isExpanded
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
