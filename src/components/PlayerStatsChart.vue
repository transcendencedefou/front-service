<template>
  <div class="flex flex-col md:flex-row min-h-screen">
    <!-- Sidebar desktop only -->
    <aside class="hidden md:flex w-64 bg-gray-900 text-white p-4 flex-col  gap-6">
      <h1 class="text-2xl font-bold">DASHBOARD</h1>
      <nav class="flex flex-col gap-4 mt-4">
        <!-- liens ici -->
      </nav>
    </aside>

    <!-- Contenu principal -->
    <div class="flex-1 flex flex-col border border-red-500">
      <!-- Bannière -->
      <section class="relative h-40 md:h-52">
        <img
          src="/src/assets/img/test_banner.jpg"
          alt="Bannière"
          class="w-full h-full object-cover"
        />

        <!-- Photo de profil -->
        <div
          class="absolute left-1/2 transform -translate-x-1/2 translate-y-1/2 md:translate-y-0 md:-bottom-20 md:left-6 md:transform-none"
        >
          <div class="w-24 h-24 md:w-40 md:h-40 bg-white rounded-full border-4 border-white overflow-hidden shadow-md border border-blue-500">
            <img
              src="/src/assets/img/test_avatar.jpg"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
          </div>
          <p class="text-center mt-2 font-semibold">{{ auth.user?.username }}</p>
        </div>
      </section>

      <!-- Nav Dashboard mobile -->
      <nav class="flex justify-around py-4 md:hidden border-t border-b border-gray-300 bg-white border border-green-500">
        <button class="text-sm font-medium text-gray-700">Accueil</button>
        <button class="text-sm font-medium text-gray-700">Matchs</button>
        <button class="text-sm font-medium text-gray-700">Profil</button>
      </nav>

      <!-- Stats -->
      <section class="flex-1 px-6 pt-20 md:pt-28 border border-yellow-500">
        <h4 class="text-lg font-bold mb-6 text-center md:text-left">STATS</h4>
        <div v-if="isLoading">Chargement des stats...</div>
        <div v-else-if="error" class="text-red-500 text-sm">{{ error }}</div>
        <div v-else class="grid grid-cols-2 gap-6 max-w-md mx-auto text-center">
          <div>
            <p class="text-3xl font-bold">{{ totalMatches }}</p>
            <p class="text-sm text-gray-500">Matchs joués</p>
          </div>
          <div>
            <p class="text-3xl font-bold">{{ totalWins }}</p>
            <p class="text-sm text-gray-500">Victoires</p>
          </div>
          <div>
            <p class="text-3xl font-bold">{{ totalLosses }}</p>
            <p class="text-sm text-gray-500">Défaites</p>
          </div>
          <div>
            <p class="text-3xl font-bold">{{ totalBallHits }}</p>
            <p class="text-sm text-gray-500">Rebonds</p>
          </div>
          <div class="col-span-2">
            <p class="text-xl font-semibold text-clpurple">{{ winRate }}%</p>
            <p class="text-sm text-gray-500">Winrate</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue'
  import { useAuthStore } from '@/stores/auth'

  const auth = useAuthStore()
  const matches = ref<any[]>([])
  const isLoading = ref(true)
  const error = ref('')

  onMounted(async () => {
    try {
      const res = await fetch(`https://localhost/users/profiles/${auth.user?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!res.ok) throw new Error('Erreur lors du chargement des matchs.')
      
      matches.value = await res.json()
    } catch (err: any) {
      error.value = err.message || 'Erreur inconnue'
    } finally {
      isLoading.value = false
    }
  })

  const totalMatches = computed(() => matches.value.length)

  const totalWins = computed(() =>
    matches.value.filter((m) => m.winnerId === auth.user?.id).length
  )

  const totalLosses = computed(() => totalMatches.value - totalWins.value)

  const totalBallHits = computed(() =>
    matches.value.reduce((acc, m) => acc + (m.ballHit || 0), 0)
  )

  const winRate = computed(() =>
    totalMatches.value > 0 ? Math.round((totalWins.value / totalMatches.value) * 100) : 0
  )
</script>
