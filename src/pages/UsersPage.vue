<template>
  <div class="users-page">
    <h1>Lista de Usuarios</h1>

    <Loader v-if="loading" />

    <div v-else>
      <table class="users-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.surname }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone }}</td>
            <td>{{ user.address }}</td>
            <td style="background: none; border: none; background-color: white">
              <button class="delete-btn" @click="deleteUser(user.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/plugins/api'
import Loader from '@/components/Loader.vue'

interface User {
  id: number
  name: string
  surname: string
  email: string
  phone: string
  address: string
}

const users = ref<User[]>([])
const loading = ref(true)

const deleteUser = async (id: number) => {
  if (!confirm('¿Seguro que quieres eliminar este usuario?')) return

  try {
    await api.delete(`/users/${id}`)
    users.value = users.value.filter((user) => user.id !== id)
  } catch (error) {
    console.error('Error al eliminar usuario', error)
  }
}
const getUsers = async () => {
  loading.value = true

  try {
    const response = await api.get('/users')

    users.value = response.data.map((u: any) => ({
      id: u.id,
      name: u.name,
      surname: u.surname,
      email: u.email,
      phone: u.phone,
      address: u.address,
    }))
  } catch (error) {
    console.error('Error al obtener usuarios', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  getUsers()
})
</script>

<style scoped lang="scss">
.users-page {
  padding: 2rem;

  h1 {
    margin-bottom: 1.5rem;
  }

  .users-table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      border: 1px solid #ccc;
      padding: 0.75rem;
      text-align: left;
    }

    th {
      background-color: #f5f5f5;
    }

    tr:nth-child(even) {
      background-color: #fafafa;
    }
  }

  .delete-btn {
    background-color: red;
    color: white;
    border: none;
    padding: 0.4rem 0.6rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.3s;

    &:hover {
      background-color: #cc3636;
    }
  }
}
</style>
