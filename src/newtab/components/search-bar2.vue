<template>
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
  <div class="search-input">
    <el-select
        v-model="value"
        multiple
        filterable
        remote
        reserve-keyword
        placeholder="Please enter a keyword"
        :remote-method="remoteMethod"
        :loading="loading"
        style="width: 100%"
    >
      <el-option
          v-for="item in options"
          :value="item.title"
      />
    </el-select>
  </div>
  <div class="search-button">
    <el-button :icon="Search" @click="performSearch"/>
  </div>

</template>

<script setup lang="ts">
import {ElSelect, ElOption, ElButton} from 'element-plus';
import { onMounted, ref } from 'vue'
import {Search} from "@element-plus/icons-vue";
const props = defineProps({
  bookmarks: []
});

interface ListItem {
  title: string
  url: string
}

const list = ref<ListItem[]>([])
const options = ref<ListItem[]>([])
const value = ref<string[]>([])
const loading = ref(false)

onMounted(() => {
  console.info(props.bookmarks)
  list.value = props.bookmarks.map((item) => {
    return { title: item.title, url: item.url }
  })
  console.info(list.value)
})

const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      options.value = list.value.filter((item) => {
        return item.title.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    options.value = []
  }
}

const selectedEngine = ref('https://www.google.com/search?q=');


const searchEngines = {
  'Google': 'https://www.google.com/search?q=',
  'Bing': 'https://www.bing.com/search?q=',
  // ...其他搜索引擎
};

const performSearch = () => {
  const query = value.value;
  const engineURL = selectedEngine.value;
  const searchURL = engineURL + encodeURIComponent(query);

  window.open(searchURL, '_blank');
};
</script>

<style scoped>
.search-select{
  width: 100px;
  :deep(.el-input__wrapper) {
    height: 40px;
    border-radius: 10px 0 0 10px;
    box-shadow: 0 0 0 0;
    padding: 4px;
  }
  :deep(.el-input--suffix){
    :focus{
      border-width: 0;
    }
  }

}
.search-input{
  width: 40%;
  :deep(.el-input__wrapper) {
    height: 40px;
    border-radius: 0 0 0 0;
    box-shadow: 0 0 0 0;
    padding: 4px;
  }
}
.search-button{
  .el-button{
    width: 50px;
    height: 48px;
    border-radius: 0 10px 10px 0;
    border-width: 0;

  }
}

</style>
