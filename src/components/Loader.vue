<template>
  <span class="loader"></span>
</template>

<style scoped>
.loader {
  display: block;
  width: 20px;
  height: 20px;
  border: 3px solid white;
  border-top-color: #2ac7bf;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
