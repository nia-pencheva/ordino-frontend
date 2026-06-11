<template>
    <div class="users-table__row__wrapper">
        <div class="users-table__row"
            @click="router.push({ name: 'user-info', params: { id: user.id } })" 
        >
            <p>{{ props.user.fullName }}</p>
        </div>

        <div 
            v-if="detailsOpen"
            class="users-table__row__details__wrapper"
        >
            <div class=users-table__row__details>
                
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { User } from './users-models';
    import router from '@/router/index';

    interface Props {
        user: User
    }

    const props = defineProps<Props>();

    const detailsOpen = ref<boolean>(false);

    function toggleDetails() {
        detailsOpen.value = !detailsOpen.value;
    }
</script>

<style lang="scss">
    .users-table__row__wrapper {
        border: 1px solid $midGray;
        border-radius: 5px;

        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1.00),
            inset 0 -1px 0 rgba(255, 255, 255, 0.40),
            inset 1px 0 0 rgba(255, 255, 255, 0.55),
            inset -1px 0 0 rgba(255, 255, 255, 0.55),
            0 1px 2px rgba(0, 0, 0, 0.20),
            0 1px 0 rgba(255, 255, 255, 0.60);

        p {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }

    .users-table__row {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background-color: white;
        border-radius: 5px;
        height: $tableRowHeight;
    }

    .users-table__row__details__wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
        padding: 20px;
        border-radius: 0px 0px 5px 5px;
        background-color: white;
    }

    .users-table__row__details {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
</style>