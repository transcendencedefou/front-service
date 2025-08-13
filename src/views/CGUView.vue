<template>
  <div class="max-w-4xl mx-auto pt-28 px-6 pb-24 text-fg">
    <h1 class="text-3xl font-bold mb-6">Conditions Générales d'Utilisation</h1>

    <p class="mb-4 text-sm opacity-70">Dernière mise à jour : {{ lastUpdate }}</p>

    <section class="space-y-4 leading-relaxed">
      <p>Bienvenue sur notre application. En accédant à ce service, vous acceptez sans réserve les présentes Conditions Générales d'Utilisation ("CGU").</p>

      <h2 class="text-xl font-semibold mt-8">1. Objet</h2>
      <p>Les présentes CGU ont pour objet de définir les modalités d'accès et d'utilisation de la plateforme de jeux (Pong & TicTacToe) et des services associés.</p>

      <h2 class="text-xl font-semibold mt-8">2. Compte utilisateur</h2>
      <p>Pour accéder à certaines fonctionnalités (classements, tournois), vous devez créer un compte. Vous êtes responsable du maintien de la confidentialité de vos identifiants.</p>

      <h2 class="text-xl font-semibold mt-8">3. Comportement</h2>
      <p>Tout comportement abusif, frauduleux ou contraire aux lois en vigueur pourra entraîner la suspension ou la suppression définitive de votre compte.</p>

      <h2 class="text-xl font-semibold mt-8">4. Données</h2>
      <p>Les données collectées (scores, matchs, identifiants techniques) sont utilisées uniquement pour le bon fonctionnement du service et l'amélioration de l'expérience de jeu.</p>

      <h2 class="text-xl font-semibold mt-8">5. Disponibilité</h2>
      <p>Nous nous efforçons d'assurer une disponibilité optimale du service mais aucune garantie d'accessibilité continue n'est fournie.</p>

      <h2 class="text-xl font-semibold mt-8">6. Limitation de responsabilité</h2>
      <p>Le service est fourni "en l'état" sans garantie expresse ou implicite. Nous ne saurions être tenus responsables des dommages indirects liés à son utilisation.</p>

      <h2 class="text-xl font-semibold mt-8">7. Modification des CGU</h2>
      <p>Les présentes CGU peuvent être mises à jour. En cas de modification substantielle, une notification pourra être affichée à la connexion.</p>

      <h2 class="text-xl font-semibold mt-8">8. Contact</h2>
      <p>Pour toute question relative aux CGU : <a href="mailto:support@example.com" class="text-accent underline">support@example.com</a></p>
    </section>

    <div class="mt-12">
      <router-link to="/" class="text-accent underline hover:opacity-80">← Retour à l'accueil</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const lastUpdate = ref(new Date().toLocaleDateString('fr-FR'))
</script>
