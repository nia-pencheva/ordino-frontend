<template>
    <div class="recipe-submit-popup__overlay">
        <TheWindow>
            <div class="recipe-submit-popup__content">
                <p>Submit recipe for approval?</p>

                <div class="recipe-submit-popup__reviewer">
                    <label>Reviewer</label>
                    <TheSelect
                        :options="chefOptions"
                        placeholder="Select reviewer..."
                        v-model="reviewerId"
                    />
                </div>

                <div class="recipe-submit-popup__buttons">
                    <TheButton @click="handleConfirm" :disabled="reviewerId == null">Confirm</TheButton>
                    <TheButton type="important" @click="emit('close')">Cancel</TheButton>
                </div>
            </div>
        </TheWindow>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { APICall } from '@/service/api/api'
import type { SelectOption } from '@/components/base/TheSelect.vue'
import type { UserRole, UsersPage } from '@/components/users/users-models'

import TheWindow from '@/components/base/TheWindow.vue'
import TheButton from '@/components/base/TheButton.vue'
import TheSelect from '@/components/base/TheSelect.vue'

interface Props {
    recipeId: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
    done: []
    close: []
}>()

const reviewerId = ref<number | null>(null)
const chefs = ref<{ id: number; fullName: string }[]>([])

const chefOptions = computed<SelectOption[]>(() =>
    chefs.value.map(c => ({ value: c.id, label: c.fullName }))
)

onMounted(async () => {
    const roles = await new APICall<UserRole[]>('users/roles', 'GET').execute()
    const chefRole = roles.find(r => r.role === 'chef')
    if (!chefRole) return

    const page = await new APICall<UsersPage>(`users?roleId=${chefRole.id}&pageSize=1000`, 'GET').execute()
    chefs.value = page.users.map(u => ({ id: u.id, fullName: u.fullName }))
})

async function handleConfirm() {
    if (reviewerId.value == null) return
    await new APICall(`recipes/${props.recipeId}/submit`, 'POST', {
        reviewerId: reviewerId.value
    }).execute()
    emit('done')
}
</script>

<style lang="scss">
    .recipe-submit-popup__overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .recipe-submit-popup__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        min-width: 260px;
    }

    .recipe-submit-popup__reviewer {
        display: flex;
        flex-direction: column;
        gap: 6px;
        width: 100%;
    }

    .recipe-submit-popup__buttons {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .recipe-submit-popup__buttons .the-button {
        padding: 4px 12px;
    }
</style>
