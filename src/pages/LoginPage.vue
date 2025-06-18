<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="handleLogin" novalidate>
      <h2>Inicio de sesión</h2>

      <div class="login-input" :class="{ 'has-error': errorEmail }">
        <input id="email" type="email" v-model="email" placeholder="" required />
        <label for="email">Correo electrónico</label>
        <span v-if="errorEmail" class="error-message">{{ errorEmail }}</span>
      </div>

      <div class="login-input" :class="{ 'has-error': errorPassword }">
        <input id="password" type="password" v-model="password" placeholder="" />
        <label for="password">Contraseña</label>
        <span v-if="errorPassword" class="error-message">{{ errorPassword }}</span>
      </div>

      <button :disabled="loading" type="submit" class="login-button">
        <span v-if="!loading">Iniciar Sesión</span>
        <Loader v-else />
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import Loader from '@/components/Loader.vue'
import { ref } from 'vue'
import api from '@/plugins/api'
import router from '@/router'

const email = ref('')
const password = ref('')
const errorEmail = ref('')
const errorPassword = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    const response = await api.post('/login', { email: email.value, password: password.value })

    const token = response.token

    localStorage.setItem('token', token)

    router.push('/users')
  } catch (error: any) {
    errorEmail.value = error.errors.email ? error.errors.email[0] : ''

    errorPassword.value = error.errors.password ? error.errors.password[0] : ''
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f4f8;
}

.login-form {
  background: white;
  padding: 2.5rem 3rem;
  border-radius: 10px;
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12);
  width: 350px;
  max-width: 90vw;
  text-align: center;

  h2 {
    margin-bottom: 1.5rem;
    color: #222;
    font-weight: 600;
  }

  .login-input {
    position: relative;
    margin-bottom: 20px;

    input {
      width: 100%;
      border-radius: 6px;
      padding: 1rem;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.3s ease;
      background: transparent;

      &:focus {
        border-color: #2ac7bf;
      }

      &:focus + label,
      &:not(:placeholder-shown) + label {
        top: -0.65rem;
        left: -0.65rem;
        font-size: 0.75rem;
        color: #2ac7bf;
        background: white;
        padding: 0 0.3rem;
        pointer-events: none;
      }
    }

    label {
      position: absolute;
      top: 1rem;
      left: 0.75rem;
      color: grey;
      font-size: 1rem;
      cursor: text;
      user-select: none;
      transition: all 0.3s ease;
    }

    &.has-error input {
      border-color: #ef4444;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.85rem;
      margin-top: 0.2rem;
      display: block;
      text-align: left;
    }
  }

  .login-button {
    width: 100%;
    padding: 0.9rem 1rem;
    font-weight: 600;
    font-size: 1.1rem;
    border: none;
    border-radius: 7px;
    background: #589904;
    color: white;
    cursor: pointer;
    transition: background 0.3s ease;

    &:disabled {
      background: #b1dfdc;
    }
  }

  .error-general {
    margin-top: 1rem;
    color: #ef4444;
    font-weight: 500;
  }
}

.loader {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid white;
  border-top-color: #2ac7bf;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
