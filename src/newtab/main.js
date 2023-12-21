import { createApp } from "vue";

import "@/common/styles/frame.styl";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import Newtab from "@/newtab/newtab.vue";
import router from "./router";
import "@/assets/fonts/iconfont/iconfont.css";

const app = createApp(Newtab);
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(router);
app.mount("#app2");
