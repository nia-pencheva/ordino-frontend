<template>
    <TheLayout>
        <TheTitle>Users</TheTitle>

        <TheButton
            @click="router.push('/users/add')"
            class="users-view__add-button"
        >
            Add
        </TheButton>

        <div class="users-view__loader" v-if="!loaded">
            <TheSpinner size="lg"/>
        </div>

        <UsersTable
            v-else
            :users="users"
            @open-reset-password-popup="openResetPasswordPopup"
            @open-delete-popup="openDeletePopup"
        />

        <ResetPasswordPopup
            v-if="resetPasswordPopup != undefined"
            :user-id="resetPasswordPopup.userId"
            :username="resetPasswordPopup.username"
            @close="resetPasswordPopup = undefined"
        />

        <DeleteUserPopup
            v-if="deletePopup != undefined"
            :user-id="deletePopup.userId"
            :username="deletePopup.username"
            @close="deletePopup = undefined"
            @deleted="handleUserDeleted"
        />
    </TheLayout>
</template>

<script setup lang="ts">
    // Imports
    import { computed, onMounted, ref } from 'vue';
    import router from '@/router';
    import { User } from '@/components/users/users-models';
    import { APICall } from '@/service/api/api';

    // Components
    import TheSpinner from '@/components/base/TheSpinner.vue';
    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import UsersTable from '@/components/users/UsersTable.vue';
    import TheButton from '@/components/base/TheButton.vue';
    import ResetPasswordPopup from '@/components/users/ResetPasswordPopup.vue';
    import DeleteUserPopup from '@/components/users/DeleteUserPopup.vue';

    // Refs
    const users = ref<User[] | undefined>(undefined);
    const resetPasswordPopup = ref<{ userId: Number; username: string } | undefined>(undefined);
    const deletePopup = ref<{ userId: Number; username: string } | undefined>(undefined);

    // Computed
    const loaded = computed<boolean>(() => {
        return users.value != undefined;
    });

    // Functions
    async function fetchUsers() {
        users.value = await (new APICall<User[]>("users")).execute();
    }

    function openResetPasswordPopup(userId: Number, username: string) {
        resetPasswordPopup.value = { userId, username };
    }

    function openDeletePopup(userId: Number, username: string) {
        deletePopup.value = { userId, username };
    }

    async function handleUserDeleted() {
        deletePopup.value = undefined;
        await fetchUsers();
    }

    // Lifecycle hooks
    onMounted(async () => {
        await fetchUsers();
    });
</script>

<style lang="scss">
    .users-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .users-view__add-button {
        width: 75px;
        padding: 4px;
        margin-bottom: 20px;
    }
</style>
