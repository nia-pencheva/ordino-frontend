const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@use "@/assets/sass/base/app.scss" as *;`
      }
    }
  }
});
