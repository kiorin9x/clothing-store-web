<template>
  <el-input v-model="search" placeholder="Search" class="min-h-[45px]"
    ><template #prefix>
      <el-icon class="el-input__icon"><Search /></el-icon> </template
  ></el-input>
  <div class="flex flex-row justify-end items-center space-x-2">
    <div class="flex flex-col">
      <div class="text-md">Sort by name</div>
      <el-select v-model="productName" placeholder="Select">
        <el-option
          label="Asc"
          value="asc"
          @click="sortProduct(data, 'asc', 'name')"
        />
        <el-option
          label="Desc"
          value="desc"
          @click="sortProduct(data, 'desc', 'name')"
        />
      </el-select>
    </div>
    <div class="flex flex-col">
      <div class="text-md">Sort by price</div>
      <el-select v-model="productPrice" placeholder="Select">
        <el-option
          label="Asc"
          value="asc"
          @click="sortProduct(data, 'asc', 'price')"
        />
        <el-option
          label="Desc"
          value="desc"
          @click="sortProduct(data, 'desc', 'price')"
        />
      </el-select>
    </div>
  </div>
  <div v-if="data.length != 0">
    <TransitionGroup
      name="list"
      tag="div"
      class="grid grid-cols-5 gap-x-4 gap-y-6 p-4"
    >
      <div
        class="p-2 cursor-pointer border-2 rounded-md border-cyan-500/30"
        @click="redirect(item.id)"
        v-for="item in filter_product_name"
        :key="item.id"
      >
        <div class="flex-col p-1">
          <div class="h-[250px]">
            <img
              loading="lazy"
              :src="item.thumbnail"
              alt="product image"
              class="w-full max-h-[250px]"
            />
          </div>
          <div class="flex flex-row justify-between items-center">
            <p class="text-2xl">{{ item.name ? item.name : "" }}</p>
            <p class="text-xl font-bold px-2 text-green-400">
              $ {{ item.price ? item.price : "" }}
            </p>
          </div>
          <div class="grid grid-cols-2">
            <div>
              <p>color</p>
              <div class="flex flex-row space-x-2">
                <span
                  v-for="el in item.variation"
                  class="w-[20px] h-[20px] rounded-full"
                  :class="`bg-${el.color} bg-${el.color}-500`"
                  :key="el.id"
                ></span>
              </div>
            </div>
            <div class="text-right px-2">
              <p>quanlity</p>
              <p>{{ item.quantity }}</p>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { ElLoading } from "element-plus";
export default defineComponent({
  name: "ProductList",
  data() {
    return {
      data: [],
      search: "",
      productName: "",
      productPrice: "",
    };
  },
  methods: {
    delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async getProductList() {
      const loading = ElLoading.service({
        lock: false,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      await this.delay(1000);
      await axios.get("http://localhost:8000/products").then((response) => {
        this.data = response.data;
      });
      loading.close();
    },
    sortProduct(arr: any, comparison_type: string, comparison_data: string) {
      if (arr.length != 0 && comparison_data in arr[0]) {
        switch (comparison_type) {
          case "asc":
            return arr.sort((a: any, b: any) => {
              if (a[comparison_data] > b[comparison_data]) return 1;
              else return -1;
            });
          case "desc":
            return arr.sort((a: any, b: any) => {
              if (a[comparison_data] < b[comparison_data]) return 1;
              else return -1;
            });
          default:
            return arr;
        }
      } else {
        return arr;
      }
    },
    redirect(id: string) {
      this.$router.push("/product/" + id);
    },
  },
  computed: {
    filter_product_name() {
      if (this.search !== "") {
        const needle = this.search.toLowerCase();
        return this.data.filter(
          (v) => v.name?.toLowerCase().indexOf(needle) > -1
        );
      }
      return this.data;
    },
  },
  mounted() {
    this.getProductList();
  },
});
</script>

<style>
.el-input__wrapper {
  background-color: rgba(0, 0, 0, 0.26);
}
</style>
