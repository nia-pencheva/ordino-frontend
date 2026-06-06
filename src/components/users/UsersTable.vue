<template>
    <div class="users-table">
        <UsersTableRow
            v-for="user in users"
            :user="user"
            @open-reset-password-popup="(id, username) => emit('open-reset-password-popup', id, username)"
            @open-delete-popup="(id, username) => emit('open-delete-popup', id, username)"
        />
    </div>
</template>

<script setup lang="ts">
    import { User } from './users-models';

    import UsersTableRow from './UsersTableRow.vue';

    interface Props {
        users: User[] | undefined
    }

    const props = defineProps<Props>();

    const emit = defineEmits<{
        'open-reset-password-popup': [id: Number, username: string]
        'open-delete-popup': [id: Number, username: string]
    }>();
</script>

<style lang="scss">
    .users-table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: 575px;
    }
</style>
