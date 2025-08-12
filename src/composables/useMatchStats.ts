import { computed, type Ref } from 'vue'

export type Match = {
  id: string
  tournoiId?: string
  userId: [string, string]            // [player1Id, player2Id]
  winnerId?: string
  scores: { player1: number; player2: number }
  powerUp?: boolean
  ballHit?: number
  createdAt: string
  updatedAt: string
}

export function useMatchStats(matches: Ref<Match[]>, userId: Ref<string>) {
  const sideOf = (m: Match, uid: string) => m.userId.indexOf(uid) as 0 | 1 | -1
  const scoreFor = (m: Match, uid: string) => {
    const s = sideOf(m, uid)
    return s === 0 ? (m.scores.player1 ?? 0) : s === 1 ? (m.scores.player2 ?? 0) : 0
  }
  const scoreAgainst = (m: Match, uid: string) => {
    const s = sideOf(m, uid)
    return s === 0 ? (m.scores.player2 ?? 0) : s === 1 ? (m.scores.player1 ?? 0) : 0
  }
  const isWin = (m: Match, uid: string) => m.winnerId === uid

  const totalMatches = computed(() => matches.value.length)
  const totalWins = computed(() => matches.value.reduce((n, m) => n + (isWin(m, userId.value) ? 1 : 0), 0))
  const totalLosses = computed(() => totalMatches.value - totalWins.value)
  const totalBallHits = computed(() => matches.value.reduce((a, m) => a + (m.ballHit ?? 0), 0))
  const totalPointsFor = computed(() => matches.value.reduce((a, m) => a + scoreFor(m, userId.value), 0))
  const totalPointsAgainst = computed(() => matches.value.reduce((a, m) => a + scoreAgainst(m, userId.value), 0))
  const pointDiff = computed(() => totalPointsFor.value - totalPointsAgainst.value)
  const winRate = computed(() => totalMatches.value ? Math.round((totalWins.value / totalMatches.value) * 100) : 0)

  // series pour les chart DOnut, Line, Bar
  const labels = computed(() => matches.value.map((_, i) => `Match ${i + 1}`))
  const powerUpsSeries = computed(() => matches.value.map(m => Number(!!m.powerUp)))
  const ballHitsSeries = computed(() => matches.value.map(m => m.ballHit ?? 0))
  const winsSeries = computed(() => matches.value.map(m => Number(isWin(m, userId.value))))

  return {
    totalMatches, totalWins, totalLosses, totalBallHits,
    totalPointsFor, totalPointsAgainst, pointDiff, winRate,
    labels, powerUpsSeries, ballHitsSeries, winsSeries,
  }
}
