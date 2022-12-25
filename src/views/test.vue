<script setup>
import { ref, reactive, onUpdated, onMounted } from "vue";
import axios from "axios";
import { ElLoading } from "element-plus";
var data = ref([]);
const getProductList = async () => {
  const loading = ElLoading.service({
    lock: false,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  await axios
    .get("https://jsonplaceholder.typicode.com/posts/")
    .then((response) => {
      data.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  loading.close();
};
onMounted(() => {
  getProductList();
});
</script>

<template>
  <div v-if="data">{{ data }}</div>
</template>
