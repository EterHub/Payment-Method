<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const mockUsers = [
  { email: 'admin@test.com', password: 'admin123' },
  { email: 'user@test.com', password: 'user123' },
  { email: 'demo@test.com', password: 'demo123' },
]

const handleLogin = async () => {
  errorMessage.value = ''

  if (!email.value) {
    errorMessage.value = 'กรุณากรอกอีเมล'
    return
  }

  if (!password.value) {
    errorMessage.value = 'กรุณากรอกรหัสผ่าน'
    return
  }

  if (!isValidEmail(email.value)) {
    errorMessage.value = 'รูปแบบอีเมลไม่ถูกต้อง'
    return
  }

  isLoading.value = true

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = mockUsers.find((u) => u.email === email.value && u.password === password.value)

    if (user) {
      localStorage.setItem('login', 'true')
      localStorage.setItem('userEmail', email.value)
      localStorage.setItem('loginTime', new Date().toISOString())

      router.push('/')
    } else {
      errorMessage.value = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
    }
  } catch (error) {
    errorMessage.value = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
  } finally {
    isLoading.value = false
  }
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    handleLogin()
  }
}
</script>
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-8">เข้าสู่ระบบ</h2>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2"> อีเมล </label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="example@email.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-black"
              :disabled="isLoading"
              @keypress="handleKeyPress"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              รหัสผ่าน
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-black"
              :disabled="isLoading"
              @keypress="handleKeyPress"
            />
          </div>

          <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              v-if="isLoading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
          </button>
        </form>

        <div class="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 mb-2">บัญชีทดสอบ:</h3>
          <div class="text-xs text-gray-600 space-y-1">
            <div><strong>Admin:</strong> admin@test.com / admin123</div>
            <div><strong>User:</strong> user@test.com / user123</div>
            <div><strong>Demo:</strong> demo@test.com / demo123</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
