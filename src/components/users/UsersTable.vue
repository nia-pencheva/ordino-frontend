<template>
    <TheTable class="users-table">
        <UsersTableRow
            v-for="user in users"
            :user="user"
            @open-reset-password-popup="(id, username) => emit('open-reset-password-popup', id, username)"
            @open-delete-popup="(id, username) => emit('open-delete-popup', id, username)"
        />
    </TheTable>
</template>

<script setup lang="ts">
    // Import
    import { User } from './users-models';

    // Components
    import UsersTableRow from './UsersTableRow.vue';
    import TheTable from '../base/table/TheTable.vue';

    interface Props {
        users: User[] | undefined
    }

    // Props
    const props = defineProps<Props>();

    // Emit
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
    }
</style>
