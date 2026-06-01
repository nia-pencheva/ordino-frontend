<template>
    <AuthLayout>
        <TheTitle>Login</TheTitle>

        <LoginForm />
    </AuthLayout>
</template>

<script setup lang="ts">
    import TheTitle from '@/components/layout/TheTitle.vue';
    import LoginForm from '@/components/auth/LoginForm.vue';
    import AuthLayout from '@/components/layout/AuthLayout.vue';
</script>


