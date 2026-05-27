<template>
    <div class="login-form__view">
        <LoginForm />
    </div>
</template>

<script setup lang="ts">
    import LoginForm from '@/components/auth/LoginForm.vue';
</script>

<style lang="scss">
    .login-form__view {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        padding: 20px;
    }
</style>
