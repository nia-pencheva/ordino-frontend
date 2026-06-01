<template>
    <div class="auth-layout">
        <slot></slot>
    </div>
</template>

<style lang="scss">
    .auth-layout {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        padding: 20px;
    }
</style>