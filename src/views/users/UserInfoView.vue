<template>
    <TheLayout>
        <div
            v-if="user == undefined"
            class="user-info-view__loader"
        >
            <TheSpinner size="lg" />
        </div>

        <template v-else>
            <TheTitle>{{ user.fullName }}</TheTitle>

            <div
                v-if="auth.user?.hasRoles([ Role.ADMIN ])" 
                class="user-info__acitons-toolbar"
            >
                <TheButton
                    class="user-info__actions-toolbar__button"
                    @click="router.push({ name: 'edit-user', params: { id: user.id } })"
                >
                    Edit
                </TheButton>
                <TheButton 
                    class="user-info__actions-toolbar__button"
                    style="width: 125px"
                    @click="resetPasswordPopupOpen = true"
                >
                    Reset password
                </TheButton>
                <TheButton 
                    v-if="auth.user?.username != user.username"
                    class="user-info__actions-toolbar__button"
                    type="important"
                    @click="deletePopupOpen = true"    
                >
                    Delete
                </TheButton>
            </div>

            <div>
                <SectionTitle>Information</SectionTitle>

                <p class="user-info__info-row">
                    <b>Username</b>: 
                    {{ user.username }}
                </p>
                <p class="user-info__info-row">
                    <b>Email</b>: 
                    {{ user.email }}
                </p>
                <p class="user-info__info-row">
                    <b>Phone Number</b>: 
                    {{ user.phoneNumber }}
                </p>
                <p 
                    class="user-info__info-row" 
                    style="text-transform: capitalize;"
                >
                    <b>Roles</b>: 
                    {{ user.roles.join(", ") }}
                </p>
            </div>

            <ResetPasswordPopup
                v-if="resetPasswordPopupOpen"
                :user-id="user.id"
                :username="user.username"
                @close="resetPasswordPopupOpen = false"
            />

            <DeleteUserPopup
                v-if="deletePopupOpen"
                :user-id="user.id"
                :username="user.username"
                @close="deletePopupOpen = false"
                @deleted="router.back()"
            />
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
    import { APICall } from '@/service/api/api';
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';

    import TheLayout from '@/components/layout/TheLayout.vue';
import TheSpinner from '@/components/base/TheSpinner.vue';
import TheTitle from '@/components/layout/TheTitle.vue';
import TheButton from '@/components/base/TheButton.vue';
import router from '@/router';
import { Role, User } from '@/components/users/users-models';
import ResetPasswordPopup from '@/components/users/ResetPasswordPopup.vue';
import DeleteUserPopup from '@/components/users/DeleteUserPopup.vue';
import { useAuth } from '@/store/auth/auth';
import SectionTitle from '@/components/base/SectionTitle.vue';

    const route = useRoute();

    const auth = useAuth();

    const user = ref<User | undefined>(undefined);
    const resetPasswordPopupOpen = ref<boolean>(false);
    const deletePopupOpen = ref<boolean>(false);

    async function fetchUser() {
        user.value = await (new APICall<User>(`users/${route.params.id}`)).execute();
    }

    onMounted(async() => {
        fetchUser();
    })
</script>

<style lang="scss">
    .user-info-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .user-info__acitons-toolbar {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
        flex-wrap: wrap;
        margin-bottom: 20px;
    }

    .user-info__actions-toolbar__button {
        width: 75px;
        padding: 4px;
    }

    .user-info__info-row {
        margin-bottom: 8px;
    }
</style>