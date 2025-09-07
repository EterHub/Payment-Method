<script setup>
import { ref } from 'vue'
import { useTransactionStore } from '@/stores/transaction'
import ConfirmModal from './ConfirmModal.vue'

const store = useTransactionStore()

const editingIndex = ref(null)
const editAmount = ref('')

const showModal = ref(false)
const modalConfig = ref({})

const startEdit = (index) => {
  editingIndex.value = index
  editAmount.value = store.transactions[index].amount
}

const showSaveEditModal = (index) => {
  if (!editAmount.value || editAmount.value <= 0) {
    alert('กรุณากรอกจำนวนเงินที่ถูกต้อง')
    return
  }

  const transaction = store.transactions[index]
  modalConfig.value = {
    title: 'ยืนยันการแก้ไข',
    message: `คุณต้องการแก้ไขจำนวนเงินจาก ฿${Number(transaction.amount).toFixed(2)} เป็น ฿${Number(editAmount.value).toFixed(2)} หรือไม่?`,
    confirmText: 'บันทึก',
    type: 'primary',
    action: 'edit',
    index: index,
  }
  showModal.value = true
}

const showDeleteModal = (index) => {
  const transaction = store.transactions[index]
  modalConfig.value = {
    title: 'ยืนยันการลบ',
    message: `คุณต้องการลบรายการ ${transaction.type} จำนวน ฿${Number(transaction.amount).toFixed(2)} หรือไม่?`,
    confirmText: 'ลบ',
    type: 'danger',
    action: 'delete',
    index: index,
  }
  showModal.value = true
}

const cancelEdit = () => {
  editingIndex.value = null
  editAmount.value = ''
}

const handleConfirm = () => {
  const action = modalConfig.value.action
  const index = modalConfig.value.index

  if (action === 'edit') {
    store.editTransaction(index, Number(editAmount.value))
    editingIndex.value = null
    editAmount.value = ''
  } else if (action === 'delete') {
    store.deleteTransaction(index)
  }

  showModal.value = false
}

const handleCancel = () => {
  showModal.value = false
}
</script>

<template>
  <div class="space-y-4 max-w-7xl mx-auto">
    <div class="hidden md:block">
      <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        <table class="w-full border-collapse">
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th class="border-b px-6 py-4 text-left text-sm font-semibold text-gray-700">
                วันที่
              </th>
              <th class="border-b px-6 py-4 text-left text-sm font-semibold text-gray-700">
                ประเภท
              </th>
              <th class="border-b px-6 py-4 text-right text-sm font-semibold text-gray-700">
                จำนวน
              </th>
              <th class="border-b px-6 py-4 text-center text-sm font-semibold text-gray-700">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr
              v-for="(t, i) in store.transactions"
              :key="i"
              class="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <td class="px-6 py-4 align-top text-gray-700">
                {{ t.createdAt }}
              </td>

              <td class="px-6 py-4 align-top">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
                  :class="
                    t.type === 'deposit'
                      ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-200'
                      : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200'
                  "
                >
                  <span
                    class="h-1.5 w-1.5 rounded-full"
                    :class="t.type === 'deposit' ? 'bg-green-500' : 'bg-red-500'"
                  ></span>
                  {{ t.type }}
                </span>
              </td>

              <td class="px-6 py-4 align-top text-right tabular-nums">
                <template v-if="editingIndex === i">
                  <input
                    v-model.number="editAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    class="border rounded-md p-2 w-32 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </template>
                <template v-else>
                  <span class="text-lg font-semibold text-gray-900">
                    ฿{{ Number(t.amount).toFixed(2) }}
                  </span>
                </template>
              </td>

              <td class="px-6 py-4 align-top text-center">
                <template v-if="editingIndex === i">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      class="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 active:scale-[.98] transition"
                      @click="showSaveEditModal(i)"
                    >
                      บันทึก
                    </button>
                    <button
                      class="px-3 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 active:scale-[.98] transition"
                      @click="cancelEdit"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </template>
                <template v-else>
                  <div class="flex items-center justify-center gap-2">
                    <button
                      class="px-3 py-1.5 rounded-md bg-yellow-400 hover:bg-yellow-500 text-black active:scale-[.98] transition"
                      @click="startEdit(i)"
                    >
                      แก้ไข
                    </button>
                    <button
                      class="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white active:scale-[.98] transition"
                      @click="showDeleteModal(i)"
                    >
                      ลบ
                    </button>
                  </div>
                </template>
              </td>
            </tr>

            <tr v-if="store.transactions.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500">ยังไม่มีรายการ</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="md:hidden space-y-3">
      <div
        v-for="(t, i) in store.transactions"
        :key="i"
        class="rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1">
            <div class="text-xs text-gray-500">{{ t.createdAt }}</div>
            <div>
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
                :class="
                  t.type === 'deposit'
                    ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-200'
                    : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200'
                "
              >
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :class="t.type === 'deposit' ? 'bg-green-500' : 'bg-red-500'"
                ></span>
                {{ t.type }}
              </span>
            </div>
          </div>

          <div class="text-right">
            <div class="text-sm text-gray-500">จำนวน</div>
            <div class="text-lg font-semibold tabular-nums text-gray-900">
              <template v-if="editingIndex === i">
                <input
                  v-model.number="editAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  class="mt-1 border rounded-md p-2 w-36 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </template>
              <template v-else> ฿{{ Number(t.amount).toFixed(2) }} </template>
            </div>
          </div>
        </div>

        <div class="mt-3 flex gap-2">
          <template v-if="editingIndex === i">
            <button
              class="flex-1 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 active:scale-[.98] transition"
              @click="showSaveEditModal(i)"
            >
              บันทึก
            </button>
            <button
              class="flex-1 px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 active:scale-[.98] transition"
              @click="cancelEdit"
            >
              ยกเลิก
            </button>
          </template>
          <template v-else>
            <button
              class="flex-1 px-3 py-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-black active:scale-[.98] transition"
              @click="startEdit(i)"
            >
              แก้ไข
            </button>
            <button
              class="flex-1 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white active:scale-[.98] transition"
              @click="showDeleteModal(i)"
            >
              ลบ
            </button>
          </template>
        </div>
      </div>

      <div
        v-if="store.transactions.length === 0"
        class="rounded-xl border p-4 text-center text-gray-500"
      >
        ยังไม่มีรายการ
      </div>
    </div>

    <ConfirmModal
      :is-open="showModal"
      :title="modalConfig.title"
      :message="modalConfig.message"
      :confirm-text="modalConfig.confirmText"
      :type="modalConfig.type"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @close="handleCancel"
    />
  </div>
</template>
