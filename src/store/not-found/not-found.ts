import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotFound = defineStore("not-found", () => {
    const notFound = ref(false);

    function show() { notFound.value = true; }
    function reset() { notFound.value = false; }

    return { notFound, show, reset };
});
