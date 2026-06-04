<template>
    <div class="form-element">
        <label :for="id">
            <slot name="label"></slot>
        </label>
        <slot :id="id"></slot>
        <ul
            v-if="hasErrors"
            class="form-element__errors"
        >
            <li v-for="error in errors?.slice().sort((a, b) => a.message.localeCompare(b.message))">
                {{ error.message }}
            </li>
        </ul>
    </div>    
</template>

<script setup lang="ts">
    
    import { ValidationError } from '@/service/api/models/response-errors';
    import { computed } from 'vue';

    interface Props {
        id: string,
        errors?: ValidationError[]
    };

    const props = defineProps<Props>();

    const hasErrors = computed<boolean>(() => {
        return props.errors != undefined && props.errors?.length !== 0 
    });
</script>

<style lang="scss">
    .form-element {
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 100%;
    }

    .form-element__errors {
        color: $fontColorError;
        font-size: 12px;
        text-align: justify;
    }
</style>