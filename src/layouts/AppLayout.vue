<template>
  <div class="app-layout">
    <!-- Navbar -->
    <Navbar v-if="!hideNavbar" @open-game-modal="openGameModal" />
    
    <!-- Main content -->
    <main :class="{ 'pt-16': !hideNavbar }">
      <slot />
    </main>
    
    <!-- Global Game Selection Modal -->
    <GameSelectionModal 
      :is-visible="isGameModalVisible" 
      @close="closeGameModal"
      @game-selected="onGameSelected" 
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import GameSelectionModal from '@/components/GameSelectionModal.vue';
import { useGameModal } from '@/composables/useGameModal';

const route = useRoute();
const { isGameModalVisible, openGameModal, closeGameModal, onGameSelected } = useGameModal();

const hideNavbar = computed(() => {
  return route.meta?.hideNavbar === true;
});
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
}
</style>
