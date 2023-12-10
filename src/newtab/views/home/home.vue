<template>
  <div id="building">
    <div class="filter" ref="filter">

    </div>
  </div>
  <el-row :gutter="20">
    <el-col :span="18" :offset="3">

      <div ref="bookmarkContainerRef" class="box-wrapper" :style="{ columnCount: layout.columnCount}">
        <el-row wrap justify="space-between">
          <div v-for="(item, index) in bookmarksByFolder" :key="index" class="box-item">
            <bookmark-component
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

const bookmarksByFolder = ref({});
// 加载书签的函数
const isChromeExtension = typeof chrome !== "undefined" && chrome.bookmarks;
const loadBookmarks = () => {
  if (isChromeExtension) {
    // 使用真实的 Chrome API
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      console.info(bookmarkTreeNodes[0].children[0].children)
      bookmarksByFolder.value = bookmarkTreeNodes[0].children[0].children;
    });
  } else {
    // 使用模拟数据
    bookmarksByFolder.value = mockBookmarks();
  }
};

const mockBookmarks = () => {
  return mockBookmarksData;
};

// 处理和转换书签数据的辅助函数
const processBookmarks = (nodes) => {
  let folderMap = {};
  const traverseNodes = (node, parentTitle) => {
    if (node.children) {
      const folderTitle = node.title || parentTitle;
      node.children.forEach(child => traverseNodes(child, folderTitle));
    } else {
      if (!folderMap[parentTitle]) {
        folderMap[parentTitle] = [];
      }
      folderMap[parentTitle].push({id: node.id, title: node.title, url: node.url});
    }
  };
  nodes.forEach(node => traverseNodes(node, ''));
  return folderMap;
};


const bookmarkCardMinWidth = 260;
const bookmarkCardMaxWidth = 280;
const columnGap = 2; // 列之间的最小间隙
// 定义一个响应式对象来存储布局信息
const layout = reactive({
  containerWidth: 0,
  columnCount: 0,
  cardWidth: 0
});

const bookmarkContainerRef = ref(null);

const calculateLayout = () => {
  console.info(bookmarkContainerRef)
  if (bookmarkContainerRef.value) {
    const containerWidth = bookmarkContainerRef.value.offsetWidth;
    console.info(containerWidth)
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

onMounted(() => {
  loadBookmarks();
  calculateLayout();
  window.addEventListener('resize', calculateLayout); // 监听窗口大小变化
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


.box-item {
  box-sizing: border-box;
  break-inside: avoid;
  padding: 10px;
}

.box-item > div {
  height: 100%;
  background: #4286F5;
  box-sizing: border-box;
}

</style>
