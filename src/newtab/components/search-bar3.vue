<template>
    <div id="searchbar" ref="searchbarRef">
        <select v-model="selectedEngine">
            <option v-for="(engine, name) in searchEngines" :key="name" :value="name">
                {{ name }}
            </option>
        </select>

        <input type="text" placeholder="Search" @input="searchAction($event)" @keyup.down="navigate(1)"
            @keyup.up="navigate(-1)" @keyup.enter="confirmSelection" />

        <button @click="searchInEngine">
            <el-icon>
                <Search />
            </el-icon>
        </button>

        <teleport to="body">
            <div v-if="searchQuery" class="popup" :style="{ top: popupTop, left: popupLeft }">
                <div v-for="(item, index) in searchResult" :key="index" :href="item.url"
                    :class="{ selected: index === selectedIndex }" @click="goToBookmark(item.url)">
                    {{ item.title }}
                </div>
            </div>
        </teleport>
    </div>
</template>

<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { ref, reactive, onMounted, watch } from "vue";

const searchResult = ref([]);
const searchQuery = ref("");
const selectedEngine = ref("Google");
const selectedIndex = ref(-1); // 新增：跟踪选中的条目索引
const searchEngines = reactive({
    Google: "https://www.google.com/search?q=",
    Bing: "https://www.bing.com/search?q=",
    DuckDuckGo: "https://duckduckgo.com/?q=",
});
const searchbarRef = ref(null);
const popupTop = ref("0px");
const popupLeft = ref("0px");
const popupWidth = ref("0px");
const props = defineProps({
    bookmarks: [],
});

function searchAction(event: any) {
    searchQuery.value = event.target.value.toLowerCase();
    searchResult.value = props.bookmarks.filter((item: any) =>
        item.title.toLowerCase().includes(searchQuery.value)
    );
}

function navigate(step: number) {
    const resultCount = searchResult.value.length;
    if (resultCount > 0) {
        selectedIndex.value = (selectedIndex.value + step + resultCount) % resultCount;
    }
}

function goToBookmark(url: string) {
    window.open(url, "_blank");
}

function confirmSelection() {
    if (selectedIndex.value >= 0 && searchResult.value[selectedIndex.value]) {
        window.open(searchResult.value[selectedIndex.value].url, "_blank");
    } else if (searchQuery.value) {
        const engineUrl = searchEngines[selectedEngine.value];
        window.open(`${engineUrl}${encodeURIComponent(searchQuery.value)}`, "_blank");
    }
}

onMounted(() => {
    const rect = searchbarRef.value.getBoundingClientRect();
    popupTop.value = `${rect.bottom + window.scrollY}px`;
    popupLeft.value = `${rect.left + window.scrollX}px`;
    updatePopupPosition();
});

function searchInEngine() {
    const engineUrl = searchEngines[selectedEngine.value];
    window.open(`${engineUrl}${encodeURIComponent(searchQuery.value)}`, "_blank");
}

function updatePopupPosition() {
    if (searchbarRef.value) {
        const rect = searchbarRef.value.getBoundingClientRect();
        popupTop.value = `${rect.bottom + window.scrollY}px`;
        popupLeft.value = `${rect.left + window.scrollX}px`;
        popupWidth.value = `${rect.width * 0.6}px`; // 新增：设置弹出框宽度
    }
}

watch(searchQuery, () => {
    if (!searchQuery.value) {
        searchResult.value = [];
        selectedIndex.value = -1; // 清空选中状态
    }
    updatePopupPosition();
});
</script>

<style>
#searchbar {
    position: relative;
    width: 40%;
    min-width: 500px;
    display: flex;
    align-items: center;
    background-color: white;
    /* 搜索框背景色 */
    border-radius: 22px;
    /* 圆角值根据实际效果调整 */
    padding: 5px;
}

#searchbar select {
    background-color: transparent;
    /* 下拉栏背景色 */
    color: black;
    /* 下拉栏文本颜色 */
    height: 100%;
    padding: 5px 15px;
    border: none;
    border-radius: 22px;
    /* 圆角 */
    -webkit-appearance: none;
    /* 移除默认的外观 */
    -moz-appearance: none;
    appearance: none;
    cursor: pointer;
}

#searchbar select:focus {
    outline: 0;
}

#searchbar select {
    background-image: url('data:image/svg+xml;utf8,<svg fill="%23ffffff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 12px;
    color: black;
    /* 图标大小 */
}

#searchbar input {
    border: none;
    background-color: transparent;
    color: black;
    margin-right: 8px;
    /* 保持一定间距 */
}

#searchbar select {
    border-radius: 10px;
    /* 下拉框圆角 */
}

#searchbar input {
    flex-grow: 1;
    outline: none;
    /* 去除获焦时的边框 */
}

#searchbar button {
    margin-right: 20px;
    border: none;
    background-color: transparent;
    /* 圆形按钮 */
    padding: 10px;
    /* 按钮大小 */
    cursor: pointer;
    /* 鼠标悬停时的指针样式 */
    outline: none;
    /* 去除获焦时的边框 */
}

#searchbar button:hover {
    color: #555;
    /* 鼠标悬停时的背景色 */
}

.popup {
    position: absolute;
    width: var(--popup-width);
    /* 使用 CSS 变量设置宽度 */
    top: 100%;
    /* 使弹出框位于 searchbar 的底部 */
    left: 0;
    /* 与 searchbar 的左边对齐 */
    margin-top: 5px;
    /* 与 searchbar 有一定间距 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: #ffffff;
    /* 与 searchbar 背景色一致 */
    overflow: hidden;
    /* 隐藏超出弹出框的部分 */
}

.popup div {
    display: flex;
    margin: 10px;
    padding: 5px;
    color: black;
    /* 链接文本颜色 */
    text-decoration: none;
    /* 去除下划线 */
    background-color: #ffffff;
    /* 链接背景色 */
}

.popup div.selected,
.popup div:hover {
    cursor: pointer;
    border-radius: 10px;
    margin: 10px;
    background-color: #e0e0e0;
    /* 选中或悬停的背景色 */
}
</style>
