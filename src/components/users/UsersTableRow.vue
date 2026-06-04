<template>
    <div class="users-table__row__wrapper">
        <div class="users-table__row"
            @click="toggleDetails"  
            :class="[ detailsOpen ? 'users-table__row--details-open' : 'users-table__row--details-closed']"
        >
            <div>
                {{ props.user.fullName }}
            </div>

            <div>
                <TheButton
                    class="users-table__toggle-details"
                >
                    <i :class="[ detailsOpen ? 'users-table__toggle-details__icon--close' : 'users-table__toggle-details__icon--open' ]"></i>
                </TheButton>
            </div>
        </div>

        <div 
            v-if="detailsOpen"
            class="users-table__row__details__wrapper"
        >
            <div class=users-table__row__details>
                <p>
                    <b>
                        Username
                    </b>: 
                    {{ props.user.username }}
                </p>
                <p>
                    <b>
                        Email
                    </b>: 
                    {{ props.user.email }}
                </p>
                <p>
                    <b>
                        Phone Number
                    </b>: 
                    {{ props.user.phoneNumber }}
                </p>
                <p style="text-transform: capitalize;">
                    <b>
                        Roles
                    </b>: 
                    {{ props.user.roles.join(", ") }}
                </p>
            </div>
            
            <div class="users-table__row__details__buttons">
                <TheButton 
                    class="users-table__row__details__button"
                    @click="router.push('/users/' + props.user.id)"
                >
                    Edit
                </TheButton>
                <TheButton 
                    class="users-table__row__details__button"
                    style="width: 125px"
                    @click="emit('open-reset-password-popup', props.user.id, props.user.username)"
                >
                    Reset password
                </TheButton>
                <TheButton 
                    v-if="auth.user?.username != props.user.username"
                    class="users-table__row__details__button"
                    type="important"
                    @click="emit('open-delete-popup', props.user.id, props.user.username)"    
                >
                    Delete
                </TheButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import router from '@/router';
    import { ref } from 'vue';
    import { User } from './users-models.js';
    import { useAuth } from '@/store/auth/auth';

    import TheButton from '../base/TheButton.vue';

    const auth = useAuth();

    interface Props {
        user: User
    }

    const props = defineProps<Props>();

    const detailsOpen = ref<boolean>(false);

    function toggleDetails() {
        detailsOpen.value = !detailsOpen.value;
    }

    const emit = defineEmits<{
        'open-reset-password-popup': [id: Number, username: string]
        'open-delete-popup': [id: Number, username: string]
    }>();
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
    }

    .users-table__row {
        padding: 10px;
        border-bottom: 1px solid $lightGrayBorder;
        background: linear-gradient(#fff, #dcdcdc);
    }

    [class*="users-table__row--"] {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background-color: white;
        border-radius: 5px;
    }

    .users-table__row--details-open {
        border-radius: 5px 5px 0px 0px;
    }

    .users-table__row--details-closed {
        border-radius: 5px;
    }

    .users-table__toggle-details {
        right: 5px;
        top: 10px;
        width: 25px;
        height: 25px;
        font-size: 18px;
    }

    .users-table__toggle-details__icon--open {
        @include arrow-down(black, 2px);

        position: relative;
        bottom: 2px;
        right: 0px;
    }

    .users-table__toggle-details__icon--close {
        @include arrow-up(black, 2px);

        position: relative;
        top: 1px;
        left: 0px;
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

    .users-table__row__details__buttons {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
        flex-wrap: wrap;
    }

    .users-table__row__details__button {
        width: 75px;
        padding: 4px;
    }
</style>