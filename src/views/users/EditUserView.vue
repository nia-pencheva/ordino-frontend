<template>
    <TheLayout :content-styles="[ 'edit-user-view' ]">
        <TheTitle>Edit user</TheTitle>

        <br>

        <div class="edit-user-view__loader" v-if="!loaded">
            <TheSpinner size="lg"/>
        </div>
        <UserForm
            v-else
            :user="user"
        />
    </TheLayout>
</template>

<script setup lang="ts">
    // Imports
    import { User } from '@/components/users/users-models';
    import { computed, onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { APICall } from '@/service/api/api';

    // Components
    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import UserForm from '@/components/users/UserForm.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';

    // Router 
    const route = useRoute();

    // Refs
    const user = ref<User | undefined>(undefined);

    // Computed
    const loaded = computed<boolean>(() => {
        return user.value !== undefined;
    });

    // Funcitons
    async function fetchUser() {
        user.value =  await (new APICall<User>("users/" + route.params.id)).execute();
    }

    // Lifecycle hooks
    onMounted(async () => {
        await fetchUser();
    })
</script>

<style lang="scss">
    .edit-user-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .edit-user-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
