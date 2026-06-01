<template>
    <TheLayout :content-styles="[ 'add-user-view' ]">
        <TheTitle>Add user</TheTitle>

        <UserForm />
    </TheLayout>
</template>

<script setup lang="ts">
    // Components
    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import UserForm from '@/components/users/UserForm.vue';
</script>

<style lang="scss">
    .add-user-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>