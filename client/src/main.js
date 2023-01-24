import App from "@/App.vue";
import PacketList from "@/components/PacketList.vue";
import CompanyList from "@/components/CompanyList.vue";
import { createApp } from "vue";
import { registerPlugins } from "@/plugins";
import { createRouter, createWebHashHistory } from "vue-router";
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
const app = createApp(App);
app.component("EasyDataTable", Vue3EasyDataTable);
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: "/packetList", component: PacketList },
        { path: "/companyList", component: CompanyList },
    ],
});
app.use(router);
registerPlugins(app);
app.mount("#app");
// Default selection
router.push("/packetList");
