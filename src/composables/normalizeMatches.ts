import type { Match } from '@/composables/useMatchStats'

const toId = (v: any): string | undefined => {
  if (typeof v === 'string') return v
  if (v && typeof v === 'object') {
    if (typeof v.id === 'string') return v.id
    if (typeof v.userId === 'string') return v.userId
  }
  return undefined
}

const normalizeParticipants = (raw: any): [string, string] => {
  if (Array.isArray(raw.userId) && raw.userId.length >= 2)
    return [String(raw.userId[0]), String(raw.userId[1])]
  if (Array.isArray(raw.participantUserIds) && raw.participantUserIds.length >= 2)
    return [String(raw.participantUserIds[0]), String(raw.participantUserIds[1])]
  if (Array.isArray(raw.participants) && raw.participants.length >= 2) {
    const a = toId(raw.participants[0])
    const b = toId(raw.participants[1])
    if (a && b) return [a, b]
  }
  return ['', '']
}

const normalizeScores = (scores: any, userIds: [string, string]) => {
  if (scores && typeof scores.player1 === 'number' && typeof scores.player2 === 'number') {
    return { player1: scores.player1, player2: scores.player2 }
  }
  const [u1, u2] = userIds
  const s1 = scores && typeof scores[u1] === 'number' ? scores[u1] : 0
  const s2 = scores && typeof scores[u2] === 'number' ? scores[u2] : 0
  return { player1: s1, player2: s2 }
}

const normalizePowerUp = (v: any): boolean => {
  if (typeof v === 'boolean') return v
  if (typeof v === 'number') return v > 0
  if (Array.isArray(v)) return v.length > 0
  if (v && typeof v === 'object' && typeof v.count === 'number') return v.count > 0
  return false
}

const normalizeBallHit = (v: any): number => {
  if (typeof v === 'number') return v
  if (v && typeof v === 'object' && typeof v.count === 'number') return v.count
  return 0
}

export function normalizeMatches(raw: any[]): Match[] {
  return (raw ?? []).map((r) => {
    const userIdTuple = normalizeParticipants(r)
    const winnerId = toId(r.winnerId ?? r.winner)
    const scores = normalizeScores(r.scores ?? {}, userIdTuple)
    return {
      id: String(r.id ?? crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)),
      tournoiId: String(r.tournoiId ?? ''),
      userId: userIdTuple,
      winnerId,
      scores,
      powerUp: normalizePowerUp(r.powerUp),
      ballHit: normalizeBallHit(r.ballHit),
      createdAt: String(r.createdAt ?? ''),
      updatedAt: String(r.updatedAt ?? ''),
    } as Match
  })
}
