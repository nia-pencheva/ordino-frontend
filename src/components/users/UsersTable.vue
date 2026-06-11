<template>
    <div class="users-table">
        <UsersTableRow
            v-for="user in users"
            :user="user"
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
</script>

<style lang="scss">
    .users-table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }
</style>
