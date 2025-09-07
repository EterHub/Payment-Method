<script setup>
import { computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'ยืนยันการกระทำ',
  },
  message: {
    type: String,
    required: true,
  },
  confirmText: {
    type: String,
    default: 'ยืนยัน',
  },
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'danger', 'success'].includes(value),
  },
  amount: {
    type: [String, Number],
    default: null,
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

const confirmButtonClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'bg-red-600 hover:bg-red-700'
    case 'success':
      return 'bg-green-600 hover:bg-green-700'
    default:
      return 'bg-blue-600 hover:bg-blue-700'
  }
})

const onConfirm = () => {
  emit('confirm')
}

const onCancel = () => {
  emit('cancel')
}

const onBackdropClick = () => {
  if (props.closeOnBackdrop) {
    emit('close')
  }
}
</script>
<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click="onBackdropClick"
    >
      <div class="absolute inset-0 backdrop-blur-sm transition-all duration-300"></div>

      <div
        class="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all border border-gray-200"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ title }}
          </h3>
        </div>

        <div class="px-6 py-4">
          <p class="text-gray-600">
            {{ message }}
          </p>

          <div v-if="amount" class="mt-3 p-3 bg-gray-50 rounded-lg">
            <div class="text-sm text-gray-500">จำนวนเงิน</div>
            <div class="text-xl font-bold text-blue-600">฿{{ Number(amount).toFixed(2) }}</div>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            @click="onCancel"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            ยกเลิก
          </button>
          <button
            @click="onConfirm"
            :class="[
              'px-4 py-2 text-sm font-medium text-white rounded-lg transition',
              confirmButtonClass,
            ]"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
