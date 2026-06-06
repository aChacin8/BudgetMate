export const formatCurrency = (amount: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)

export const formatMonth = (month: number, year: number) => {
  const date = new Date(year, month - 1)
  return date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
}

export const periodLabel = (type: 'monthly' | 'biweekly', periodNumber: number, month: number, year: number) => {
  const monthName = formatMonth(month, year)
  if (type === 'monthly') return `${monthName}`
  return `${monthName} — Quincena ${periodNumber}`
}
