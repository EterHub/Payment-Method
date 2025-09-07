import { defineStore } from 'pinia'

const STORAGE_KEY = 'transactions@v1'

function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveTransactions(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: loadTransactions(),
  }),

  getters: {
    balance: (state) =>
      state.transactions.reduce(
        (sum, t) =>
          t.type === 'deposit' ? sum + Number(t.amount || 0) : sum - Number(t.amount || 0),
        0,
      ),
  },

  actions: {
    deposit(amount) {
      amount = Number(amount)
      if (!amount || amount <= 0) return
      if (amount > 1000000) {
        alert('ฝากเงินเกินจำนวนที่กำหนด')
        return
      }
      this.transactions.push({
        type: 'deposit',
        amount,
        createdAt: new Date().toLocaleString(),
      })
      saveTransactions(this.transactions)
    },

    withdraw(amount) {
      amount = Number(amount)
      if (!amount || amount <= 0) return
      if (amount > 1000000) {
        alert('ถอนเงินเกินจำนวนที่กำหนด')
        return
      }
      if (amount > this.balance) {
        alert('ยอดเงินไม่เพียงพอ')
        return
      }
      this.transactions.push({
        type: 'withdraw',
        amount,
        createdAt: new Date().toLocaleString(),
      })
      saveTransactions(this.transactions)
    },

    editTransaction(index, newAmount) {
      if (index < 0 || index >= this.transactions.length) return

      const current = this.transactions[index]

      newAmount = Number(newAmount)
      if (!newAmount || newAmount <= 0) {
        alert('จำนวนเงินต้องมากกว่า 0')
        return
      }
      if (newAmount > 1000000) {
        alert('จำนวนเงินเกินจำนวนที่กำหนด')
        return
      }

      const cloned = [...this.transactions]
      cloned[index] = {
        ...current,
        amount: newAmount,
      }

      const nextBalance = cloned.reduce(
        (sum, t) => (t.type === 'deposit' ? sum + t.amount : sum - t.amount),
        0,
      )

      if (nextBalance < 0) {
        alert('แก้ไขนี้ทำให้ยอดเงินติดลบ')
        return
      }

      this.transactions[index].amount = newAmount
      this.transactions[index].createdAt = new Date().toLocaleString() // อัปเดตเวลาแก้ไข
      saveTransactions(this.transactions)
    },

    deleteTransaction(index) {
      if (index < 0 || index >= this.transactions.length) return
      this.transactions.splice(index, 1)
      saveTransactions(this.transactions)
    },
  },
})
