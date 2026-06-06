interface Props {
  label: string
  value: string
  icon: string
  color: 'green' | 'red' | 'blue' | 'purple'
}

const colors = {
  green: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800',
  red: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-100 dark:border-red-800',
  blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800',
  purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-800'
}

export default function StatCard({ label, value, icon, color }: Props) {
  return (
    <div className={`rounded-2xl border p-5 flex items-center gap-4 transition-colors ${colors[color]}`}>
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider opacity-70">{label}</p>
        <p className="text-2xl font-bold mt-0.5">{value}</p>
      </div>
    </div>
  )
}
