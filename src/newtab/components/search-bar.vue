<template>
  <div class="search-container">
    <el-autocomplete
        v-model="searchQuery"
        placeholder="搜索书签或网络..."

        @keyup.enter="performSearch"
        :trigger-on-focus="false"
        clearable
        @clear="clearSearch"
        :fetch-suggestions="querySearch"
        @select="jumpToSelected"
        :style="{ width: '100%' }"
        :popper-append-to-body="false"
    >
      <template #prepend>
        <div class="search-select">
          <el-select v-model="selectedEngine" placeholder="选择搜索引擎">
            <el-option
                v-for="(url, name) in searchEngines"
                :key="name"
                :label="name"
                :value="url"
            ></el-option>
          </el-select>
        </div>
      </template>


      <template #append>
        <el-button :icon="Search" @click="performSearch"/>
      </template>
    </el-autocomplete>



  </div>
</template>

<script setup lang="js">
import {ref} from 'vue';
import {ElSelect, ElOption, ElButton} from 'element-plus';
import {Search} from "@element-plus/icons-vue";

const props = defineProps({
  bookmarks: ''
});
const createFilter = (queryString) => {
  return (bookmarks) => {
    return bookmarks.value.toLowerCase().includes(queryString.toLowerCase());
  };
};
const querySearch = (queryString, callback) => {
  const bookmarks = props.bookmarks.map(item => {
    item.value = item.title;
    return item
  })
  console.info(bookmarks);
  const results = queryString
      ? bookmarks.filter(createFilter(queryString))
      : bookmarks;

  console.info(results);
  // 调用回调函数返回建议
  callback(results);
};
const jumpToSelected = (item) => {
  window.open(item.url);
}
const selectedEngine = ref('https://www.google.com/search?q=');


const searchEngines = {
  'Google': 'https://www.google.com/search?q=',
  'Bing': 'https://www.bing.com/search?q=',
  // ...其他搜索引擎
};

const searchQuery = ref('');
const performSearch = () => {
  const query = searchQuery.value;
  const engineURL = selectedEngine.value;
  const searchURL = engineURL + encodeURIComponent(query);

  window.open(searchURL, '_blank');
};
const clearSearch = () => {
  searchQuery.value = '';
}

</script>

<style scoped>
.search-container {
  display: flex; /* 使用Flexbox */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin: 20px 0; /* 提供上下间距 */
  width: 100%;

  .search-select {
    width: 100px;

    :deep(.el-input__wrapper) {
      border-radius: 5px 0 0 5px;
      box-shadow: 0 0 0 0;
      padding: 4px;
    }
  }


  .search-input {
    width: 60%;
  }
}


</style>
