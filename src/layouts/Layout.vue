<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isLoggedIn = ref(false)
const isSidebarOpen = ref(true)

onMounted(() => {
  checkLoginStatus()
})

const checkLoginStatus = () => {
  const loginStatus = localStorage.getItem('login')
  const loginTime = localStorage.getItem('loginTime')

  if (loginStatus === 'true' && loginTime) {
    const loginDate = new Date(loginTime)
    const now = new Date()
    const diffHours = (now - loginDate) / (1000 * 60 * 60)

    if (diffHours > 24) {
      logout()
    } else {
      isLoggedIn.value = true
    }
  } else {
    isLoggedIn.value = false
  }
}

const logout = () => {
  isLoggedIn.value = false
  localStorage.removeItem('login')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('loginTime')
  router.push('/login')
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const isActive = (path) => route.path === path
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <div class="h-16"></div>

    <header class="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-screen-xl mx-auto w-full px-4">
        <div class="h-16 flex items-center gap-4">
          <button
            class="p-2 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition"
            @click="toggleSidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div class="flex-1 text-xl font-semibold text-gray-900">ClickNext</div>

          <button
            class="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 active:scale-95 transition shadow-sm"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <aside
      :class="[
        'fixed top-16 left-0 bottom-0 w-64 border-r border-gray-200 bg-white z-40 transition-transform duration-200 shadow-lg',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="h-full flex flex-col">
        <div class="px-4 py-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900">Menu</h2>
        </div>

        <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <RouterLink
            to="/"
            class="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition group"
            :class="
              isActive('/')
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            "
          >
            <svg
              class="mr-3 h-5 w-5"
              :class="isActive('/') ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
            Deposit/Withdraw
          </RouterLink>

          <RouterLink
            to="/transaction"
            class="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition group"
            :class="
              isActive('/transaction')
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            "
          >
            <svg
              class="mr-3 h-5 w-5"
              :class="
                isActive('/transaction')
                  ? 'text-blue-700'
                  : 'text-gray-400 group-hover:text-gray-500'
              "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            Transaction
          </RouterLink>
        </nav>
      </div>
    </aside>

    <main class="flex-1 bg-gray-50">
      <div class="max-w-screen-xl mx-auto w-full px-4 py-6">
        <slot />
      </div>
    </main>
  </div>
</template>
