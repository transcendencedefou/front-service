export const chartTypes = ['doughnut', 'bar', 'line'] as const
export type ChartType = typeof chartTypes[number]
