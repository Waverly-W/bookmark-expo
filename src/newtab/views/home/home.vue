<template>
  <div id="building">
    <div class="filter" ref="filter">
    </div>
  </div>
  <el-row :gutter="20">
    <el-col :span="18" :offset="3">
      <el-row class="search-bar" justify="center">
        <search-bar2 :bookmarks="bookmarksList"></search-bar2>
      </el-row>
      <el-row wrap class="single-bookmark" >
        <div v-for="(item, index) in bookmarksBySingle" :key="index">
          <bookmark-single :title="item.title" :url="item.url"></bookmark-single>
        </div>
      </el-row>
      <div ref="bookmarkContainerRef" class="box-wrapper" :style="{ columnCount: layout.columnCount}">
        <el-row wrap justify="space-between">
          <div v-for="(item, index) in bookmarksByFolder" :key="index" class="box-item">
            <bookmark-component v-if="item.children"
                :title="item.title"
                :bookmarks-data="item.children"
                :width="layout.cardWidth + 'px'"
            ></bookmark-component>
          </div>
        </el-row>
      </div>

    </el-col>
  </el-row>

</template>

<script setup>
/*global chrome*/
import {ref, onMounted, reactive, onUnmounted} from 'vue';
import {mockBookmarksData} from "@/newtab/views/home/mockBookmarksData.js";
import BookmarkComponent from "@/newtab/components/bookmark-component.vue";
import BookmarkSingle from "@/newtab/components/bookmark-single.vue";
import SearchBar from "@/newtab/components/search-bar.vue";
import SearchBar2 from "@/newtab/components/search-bar2.vue";
const bookmarksAll = ref({});
const bookmarksByFolder = ref({});
const bookmarksBySingle = ref({});
// 加载书签的函数
const isChromeExtension = typeof chrome !== "undefined" && chrome.bookmarks;
const loadBookmarks = () => {
  if (isChromeExtension) {
    // 使用真实的 Chrome API
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      bookmarksAll.value = bookmarkTreeNodes[0].children[0].children;
      splitBookmarks(bookmarkTreeNodes[0].children[0].children);
    });
  } else {
    const mockData = mockBookmarksData;
    bookmarksAll.value = mockData  // 使用模拟数
    splitBookmarks(mockData);
  }
};

const splitBookmarks = (bookmarksData) =>{
  const folder = [];
  const single = [];
  for (let i = 0; i < bookmarksData.length; i++) {
    if (bookmarksData[i].children && bookmarksData[i].children.length > 0) {
      // 如果元素有children字段，则添加到withChildren中
      folder.push(bookmarksData[i]);
    } else {
      // 如果元素没有children字段，则添加到withoutChildren中
      single.push(bookmarksData[i]);
    }
  }
  bookmarksByFolder.value = folder;
  bookmarksBySingle.value = single;
}

const bookmarkCardMinWidth = 260;
const bookmarkCardMaxWidth = 280;
const columnGap = 4; // 列之间的最小间隙
// 定义一个响应式对象来存储布局信息
const layout = reactive({
  containerWidth: 0,
  columnCount: 0,
  cardWidth: 0
});

const bookmarkContainerRef = ref(null);

const calculateLayout = () => {
  if (bookmarkContainerRef.value) {
    const containerWidth = bookmarkContainerRef.value.offsetWidth;
    let columnCount = Math.floor(containerWidth / (bookmarkCardMinWidth+columnGap));
    columnCount = Math.max(columnCount, 1); // 至少有一列
    let cardWidth = containerWidth / columnCount;
    cardWidth = Math.min(cardWidth-columnGap, bookmarkCardMaxWidth);
    cardWidth = Math.max(cardWidth-columnGap, bookmarkCardMinWidth);
    layout.containerWidth = containerWidth;
    layout.columnCount = columnCount;
    layout.cardWidth = cardWidth;
  }
};

const bookmarksList =ref([]);
const findBookmarksWithoutChildren = (bookmarks) => {

  for (let i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i].children && bookmarks[i].children.length > 0) {
      // 如果书签有children字段，递归搜索其子项
      findBookmarksWithoutChildren(bookmarks[i].children);
    } else {
      // 没有children字段，将书签添加到bookmarksList中
      bookmarksList.value.push(bookmarks[i]);
    }
  }
};

onMounted(() => {
  loadBookmarks();
  calculateLayout();
  window.addEventListener('resize', calculateLayout); // 监听窗口大小变化
  findBookmarksWithoutChildren(bookmarksAll.value)
  // localStorage.setItem("bookmarks", bookmarksAll.value)
});
onUnmounted(() => {
  window.removeEventListener('resize', calculateLayout); // 组件卸载时移除监听器
});

</script>

<style scoped lang="scss">
#building {
  background: url("./img.png");
  width: 100%; //大小设置为100%
  height: 100%; //大小设置为100%
  position: fixed;
  background-size: 100% 100%;
  top: 0;
  left: 0;
}

.filter {
  width: 100%; //大小设置为100%
  height: 100%; //大小设置为100%
  backdrop-filter: blur(5px);
}

.full_page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow: auto;
  color: white;
}

.box-wrapper {
  width: 100%;
}
.single-bookmark{
  //box-sizing: border-box;
  //break-inside: avoid;
  padding: 5px;
}

.box-item {
  box-sizing: border-box;
  break-inside: avoid;
  padding: 5px;
}

.box-item > div {
  height: 100%;
  background: #4286F5;
  box-sizing: border-box;
}

.search-bar{
  align-items: center;
  align-content: center;
  height: 100px;
}

</style>
