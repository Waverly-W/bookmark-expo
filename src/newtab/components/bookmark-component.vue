<template>
  <div class="bookmark-card" :style="{ backgroundColor: randomBackgroundColor,width:width}">
    <div class="card-header" style="mix-blend-mode: difference;color: white">
      |&nbsp;&nbsp;{{ title }}
    </div>
    <div class="bookmark-list">
      <div v-for="(item,index) in bookmarksData" :key="index" class="bookmark-item">


        <el-text v-if="item.url" class="bookmark-text"
                 truncated
                 style="mix-blend-mode: difference;color: white;"
                 @click="locationToUrl(item.url)"

        >
          <el-icon size="14px">
            <Link/>
          </el-icon>
          {{ item.title }}
        </el-text>


        <sub-bookmark-component v-else :bookmarks-data="item.children" :title="item.title"
                                :width="width-'20px'"></sub-bookmark-component>

      </div>

    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {Folder, Link} from "@element-plus/icons-vue";
import SubBookmarkComponent from "@/newtab/components/sub-bookmark-component.vue";

const props = defineProps({
  title: "",
  bookmarksData: {
    type: Object,
    default: () => ref({})
  },
  cardColor: '#000000',
  textColor: '#ffffff',
  width: '220px',
});

const colorArray = [
  '#414b4b',
  '#383c51',
  '#3f534b',
  '#505e60',
  '#3a3a3a',
  '#443a3a'];
// Function to get a random color from the array
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colorArray.length);
  return colorArray[randomIndex];
};

const randomBackgroundColor = ref(getRandomColor());
const toggle = (item) => {
  if (item.children) {
    item.isExpanded = !item.isExpanded;
  }
};

const hasChildren = (item) => {
  return item.children && item.children.length > 0;
};

function locationToUrl(url) {
  window.open(url);
}

</script>

<style scoped lang="scss">

.bookmark-card {
  height: auto;
  border-radius: 10px;
  padding: 5px;
  margin: 10px;
  overflow: auto;

  .card-header {
    font-size: 1em;
    font-weight: bold;
    margin: 5px;
  }

  .bookmark-list {
    padding: 0;
    color: white;
    overflow: scroll;

    .bookmark-item {
      height: auto;
      padding: 2px 2px;
      width: auto;
      transition: all 0.3s ease; /* 为下划线添加平滑过渡效果 */


      &:hover {
        background-color: #484848C1;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
}

:deep(.bookmark-text:hover) {
  text-decoration: underline; /* 鼠标悬停时添加下划线 */
}


/* Add additional styling as needed */
</style>
