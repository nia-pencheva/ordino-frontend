import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { APIHandledError } from "./service/api/models/response-errors";

const app = createApp(App);

app.config.errorHandler = (err) => {
    if (err instanceof APIHandledError) return;
    console.error(err);
};

app.use(router).use(createPinia()).mount("#app");
