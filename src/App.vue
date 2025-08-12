<script lang="ts" setup>
  import Navbar from './components/Navbar.vue'
  import CustomCursor from './components/CustomCursor.vue'
  import GameSelectionModal from './components/GameSelectionModal.vue'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useGameModal } from '@/composables/useGameModal'

  const route = useRoute()
  const showNavbar = computed(() => !route.meta.hideNavbar)
  const { isGameModalVisible, openGameModal, closeGameModal, onGameSelected } = useGameModal()
</script>

<template>
  <div class="relative w-full min-h-screen overflow-hidden">
    <Navbar v-if="showNavbar" @open-game-modal="openGameModal" />
    <CustomCursor />
    <router-view />
    
    <!-- Global Game Selection Modal -->
    <GameSelectionModal 
      :isVisible="isGameModalVisible"
      @close="closeGameModal"
      @gameSelected="onGameSelected"
    />
  </div>
</template>

<style scoped>
</style>

