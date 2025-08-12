export const chartTypes = ['doughnut', 'line'] as const
export type ChartType = typeof chartTypes[number]
