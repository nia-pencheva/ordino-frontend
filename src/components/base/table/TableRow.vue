<template>
    <div class="table__row">
        <slot></slot>
    </div>
</template>

<style lang="scss">
    .table__row {
        padding: 10px;
        border-bottom: 1px solid $lightGrayBorder;
        background: linear-gradient(#fff, #dcdcdc);
    }
</style>
