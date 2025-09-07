<script setup>
import { ref } from 'vue'
import { useTransactionStore } from '@/stores/transaction'
import ConfirmModal from './ConfirmModal.vue'

const store = useTransactionStore()
const amount = ref('')

const showModal = ref(false)
const modalConfig = ref({})

const showDepositModal = () => {
  if (!amount.value || amount.value <= 0) {
    alert('กรุณากรอกจำนวนเงินที่ถูกต้อง')
    return
  }

  modalConfig.value = {
    title: 'ยืนยันการฝากเงิน',
    message: 'คุณต้องการฝากเงินจำนวนนี้หรือไม่?',
    confirmText: 'ฝากเงิน',
    type: 'success',
    amount: amount.value,
    action: 'deposit',
  }
  showModal.value = true
}

const showWithdrawModal = () => {
  if (!amount.value || amount.value <= 0) {
    alert('กรุณากรอกจำนวนเงินที่ถูกต้อง')
    return
  }

  if (Number(amount.value) > store.balance) {
    alert('จำนวนเงินที่ถอนเกินยอดคงเหลือ')
    return
  }

  modalConfig.value = {
    title: 'ยืนยันการถอนเงิน',
    message: 'คุณต้องการถอนเงินจำนวนนี้หรือไม่?',
    confirmText: 'ถอนเงิน',
    type: 'danger',
    amount: amount.value,
    action: 'withdraw',
  }
  showModal.value = true
}

const handleConfirm = () => {
  const action = modalConfig.value.action
  const amountValue = amount.value

  if (action === 'deposit') {
    store.deposit(amountValue)
  } else if (action === 'withdraw') {
    store.withdraw(amountValue)
  }

  amount.value = ''
  showModal.value = false
}

const handleCancel = () => {
  showModal.value = false
}
</script>

<template>
  <div class="flex items-center justify-center p-4">
    <div class="w-full max-w-md space-y-4 p-6 bg-white border rounded-lg shadow-md">
      <div>
        <div class="text-sm opacity-70 text-black">ยอดคงเหลือ</div>
        <div class="text-2xl font-bold break-words text-black">
          {{ store.balance.toFixed(2) }}
        </div>
      </div>

      <input
        v-model="amount"
        type="number"
        step="0.01"
        placeholder="จำนวนเงิน"
        class="border p-2 rounded w-full text-black"
      />

      <div class="flex flex-col sm:flex-row gap-2">
        <button
          @click="showDepositModal"
          class="flex-1 px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          ฝาก
        </button>
        <button
          @click="showWithdrawModal"
          class="flex-1 px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        >
          ถอน
        </button>
      </div>
    </div>

    <ConfirmModal
      :is-open="showModal"
      :title="modalConfig.title"
      :message="modalConfig.message"
      :confirm-text="modalConfig.confirmText"
      :type="modalConfig.type"
      :amount="modalConfig.amount"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @close="handleCancel"
    />
  </div>
</template>
