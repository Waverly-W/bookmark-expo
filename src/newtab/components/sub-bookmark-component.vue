<template>
  <div class="sub-bookmark-card" :style="{ width: width }">
    <div class="sub-bookmark-list">
      <div @click="changeFold" style="width: 100%">
        <el-space>
          <el-icon v-if="isFold" size="14px"><ArrowRightBold /></el-icon>
          <el-icon v-else size="14px"><ArrowDownBold /></el-icon>
          <el-text style="mix-blend-mode: difference; color: white">{{ title }}</el-text>
        </el-space>
      </div>

      <div
        v-if="!isFold"
        v-for="(item, index) in bookmarksData"
        :key="index"
        class="sub-bookmark-item"
      >
        <el-space v-if="item.url">
          <el-icon size="14px">
            <Link />
          </el-icon>
          <el-text
            class="sub-bookmark-text"
            truncated
            style="mix-blend-mode: difference; color: white"
            @click="locationToUrl(item.url)"
          >
            {{ item.title }}
          </el-text>
        </el-space>
        <el-space v-else>
          <div>
            <sub-bookmark-component
              :bookmarks-data="item.children"
              :title="item.title"
              :width="width - '20px'"
            ></sub-bookmark-component>
          </div>
        </el-space>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ArrowDownBold, ArrowRightBold, Folder, Link } from "@element-plus/icons-vue";

const props = defineProps({
  title: "",
  bookmarksData: {
    type: Object,
    default: () => ref({}),
  },
  width: "220px",
});
const isFold = ref(true);

function changeFold() {
  console.info(isFold.value);
  isFold.value = !isFold.value;
}
function locationToUrl(url) {
  window.open(url);
}
</script>

<style scoped lang="scss">
.sub-bookmark-card {
  margin: 0;
  padding: 0;
  .sub-bookmark-list {
    padding: 0;
    color: white;
    overflow: scroll;

    .sub-bookmark-item {
      padding: 2px 4px;
      transition: all 0.3s ease; /* 为下划线添加平滑过渡效果 */
      &:hover {
        background-color: #484848c1;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
}

:deep(.sub-bookmark-text:hover) {
  text-decoration: underline; /* 鼠标悬停时添加下划线 */
}

</style>
