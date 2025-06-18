<template>
  <div class="users-page">
    <h1>Lista de Usuarios</h1>

    <Loader v-if="loading" />

    <div v-else>
      <div class="csv-container">
        <button class="csv-btn" @click="addCsv">Importar CSV</button>
        <input ref="csv" type="file" accept=".csv" @change="handleCsv" style="display: none" />
      </div>

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
              <button
                v-if="deletingUser != user.id"
                class="delete-btn"
                @click="deleteUser(user.id)"
              >
                Eliminar
              </button>

              <Loader v-else />
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
const deletingUser = ref(0)
const csv = ref<HTMLInputElement | null>(null)

const deleteUser = async (id: number) => {
  if (!confirm('¿Seguro que quieres eliminar este usuario?')) return

  deletingUser.value = id

  try {
    await api.delete(`/users/${id}`)
    users.value = users.value.filter((user) => user.id !== id)
  } catch (error) {
    console.error('Error al eliminar usuario', error)
  }

  deletingUser.value = 0
}

function mapUsers(data: any[]): User[] {
  return data.map((u) => ({
    id: u.id,
    name: u.name,
    surname: u.surname,
    email: u.email,
    phone: u.phone,
    address: u.address,
  }))
}

const getUsers = async () => {
  loading.value = true

  try {
    const response = await api.get('/users')

    users.value = mapUsers(response.data)
  } catch (error) {
    console.error('Error al obtener usuarios', error)
  } finally {
    loading.value = false
  }
}

function addCsv() {
  csv.value?.click()
}

async function handleCsv(event: Event) {
  const target = event.target as HTMLInputElement

  const files = target.files

  if (!files || files.length === 0) return

  try {
    const formData = new FormData()

    formData.append('csv', files[0])

    const response = await api.post('/users/import', formData)

    users.value = [mapUsers([response.data])[0], ...users.value]
  } catch (error) {
    alert('Error al importar el archivo CSV.')
  } finally {
    const target = event.target as HTMLInputElement
    target.value = ''
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

    &:hover {
      background-color: #cc3636;
    }
  }

  .csv-container {
    margin-bottom: 24px;
  }

  .csv-btn {
    background-color: #2ac7bf;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    font-weight: bold;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
}
</style>
