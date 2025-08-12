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
    const a = toId(raw.participants[0]) ?? toId(raw.participants[0]?.user)
    const b = toId(raw.participants[1]) ?? toId(raw.participants[1]?.user)
    return [String(a ?? ''), String(b ?? '')]
  }
  return ['', '']
}

const normalizeScores = (scores: any, userIds: [string, string]) => {
  if (scores && typeof scores.player1 === 'number' && typeof scores.player2 === 'number') {
    return { player1: scores.player1, player2: scores.player2 }
  }
  // Nouveau format éventuel: scores.players = [{ name, score }, { name, score }]
  if (scores && Array.isArray(scores.players) && scores.players.length >= 2) {
    const s1 = typeof scores.players[0]?.score === 'number' ? scores.players[0].score : 0
    const s2 = typeof scores.players[1]?.score === 'number' ? scores.players[1].score : 0
    return { player1: s1, player2: s2 }
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
  if (Array.isArray(v)) return v.length
  if (v && typeof v === 'object' && typeof v.count === 'number') return v.count
  return 0
}

const deriveWinnerId = (raw: any): string | undefined => {
  // winner peut être string id, ou { userId }, ou { username }
  const direct = toId(raw.winnerId ?? raw.winner)
  if (direct) return direct
  const wUser = typeof raw.winner === 'object' ? raw.winner?.username : undefined
  if (!wUser) return undefined
  // Chercher dans participants le userId correspondant au username gagnant
  if (Array.isArray(raw.participants)) {
    const found = raw.participants.find((p: any) => p?.username === wUser && (p?.userId || p?.user?.id))
    if (found) return String(found.userId ?? found.user?.id)
  }
  return undefined
}

const deriveParticipantsNames = (raw: any): [string, string] | undefined => {
  if (Array.isArray(raw.participants) && raw.participants.length >= 2) {
    const n1 = typeof raw.participants[0]?.username === 'string' ? raw.participants[0].username : ''
    const n2 = typeof raw.participants[1]?.username === 'string' ? raw.participants[1].username : ''
    if (n1 || n2) return [n1, n2]
  }
  return undefined
}

export function normalizeMatches(raw: any): Match[] {
  const list: any[] = Array.isArray(raw) ? raw : (raw && Array.isArray(raw.matches) ? raw.matches : [])
  return list.map((r: any) => {
    const userIdTuple = normalizeParticipants(r)
    const winnerId = deriveWinnerId(r)
    const scores = normalizeScores(r.scores ?? {}, userIdTuple)
    const gameType = (r.gameType || r.tournoi?.gameType) as 'PONG' | 'TICTACTOE' | undefined
    const participantsNames = deriveParticipantsNames(r)
    return {
      id: String(r.id ?? crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)),
      tournoiId: r.tournoiId ? String(r.tournoiId) : undefined,
      userId: userIdTuple,
      winnerId,
      scores,
      powerUp: normalizePowerUp(r.powerUp),
      ballHit: normalizeBallHit(r.ballHit),
      createdAt: String(r.createdAt ?? ''),
      updatedAt: String(r.updatedAt ?? ''),
      gameType,
      participantsNames,
    } as Match
  })
}
