<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { ElLoading } from "element-plus";
import { ShoppingTrolley } from "@element-plus/icons-vue";

const rate = ref(4.9);
const rating = ref(9.1);
const sold = ref(12.3);
const selected = ref({
  size: "",
  color: "",
  quantity: 1,
});
var DETAIL_PRODUCT_BY_COLOR = ref({});
var data = ref([]);
const route = useRoute();
var price = ref(0);
const urls = [
  "http://dummyimage.com/156x100.png/cc0000/ffffff",
  "http://dummyimage.com/203x100.png/ff4444/ffffff",
  "http://dummyimage.com/241x100.png/5fa2dd/ffffff",
  "https://robohash.org/suntisteaperiam.png?size=50x50&set=set1",
];

const getProductList = async () => {
  const loading = ElLoading.service({
    lock: false,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  await axios
    .get("http://localhost:8000/products/" + route.params.id)
    .then((response) => {
      data.value = response.data;
      DETAIL_PRODUCT_BY_COLOR.value = data.value.variation[0];
      price.value = findHighestPrice(data.value);
    })
    .catch((error) => {
      console.log(error);
    });
  loading.close();
};

const findHighestPrice = (
  arr: { id: number; color: string; variation: {}[] }[]
) => {
  let highest_price_by_color = arr.variation.map((element: any) => {
    if (element.detail) {
      let max = Math.max(...element.detail.map((o: any) => o.price));
      return max;
    }
  });
  return highest_price_by_color.reduce((a, b) => Math.max(a, b), -Infinity);
};

const BuyProduct = () => {
  console.log(selected.value);
};

watch(
  selected,
  (newValue) => {
    let result = data.value.variation.find(
      (item) => item.color == newValue.color
    );
    if (result) {
      DETAIL_PRODUCT_BY_COLOR.value = result;
    }
    if (newValue.color !== "" && newValue.size !== "") {
      price.value =
        DETAIL_PRODUCT_BY_COLOR.value.detail.find(
          (item) => item.size == newValue.size
        ).price * newValue.quantity;
    }
  },
  { deep: true }
);

onMounted(() => {
  getProductList();
});
</script>

<template>
  <div class="grid grid-cols-3 min-h-[45vh]">
    <div class="flex justify-center p-6">
      <img
        :src="data.thumbnail"
        :alt="data.name"
        class="w-full max-h-[450px]"
      />
    </div>
    <div class="col-span-2 p-6">
      <div class="space-y-5">
        <div class="flex justify-between items-center">
          <p class="text-3xl font-bold">{{ data.name }}</p>
          <p class="cursor-pointer">report</p>
        </div>
        <div class="flex flex-row space-x-2">
          <div
            class="flex flex-row items-center space-x-2 border-r-2 border-cyan-300"
          >
            <p>{{ rate }}</p>
            <el-rate
              v-model="rate"
              disabled
              text-color="#ff9900"
              size="large"
            ></el-rate>
          </div>
          <div class="flex items-center px-2 border-r-2 border-cyan-300">
            <p>{{ rating }}k Rating</p>
          </div>
          <div class="flex items-center">
            <p>{{ sold }}k Sold</p>
          </div>
        </div>
        <div class="text-2xl text-green-600">
          <p>$ {{ price }}</p>
        </div>
        <div>
          <p>Color</p>
          <div class="flex flex-row space-x-5 pl-16">
            <el-radio-group v-model="selected.color">
              <el-radio
                size="large"
                border
                v-for="item in data.variation"
                :key="item.id"
                :label="item.color"
                :disabled="item.total < 1"
                ><p :class="item.total < 1 ? 'text-zinc-500' : 'text-white'">
                  {{ item.color }}
                </p></el-radio
              >
            </el-radio-group>
          </div>
        </div>
        <div>
          <p>Size</p>
          <div class="flex flex-row space-x-5 pl-16">
            <el-radio-group v-model="selected.size">
              <el-radio
                size="large"
                border
                v-for="item in DETAIL_PRODUCT_BY_COLOR.detail"
                :key="item.id"
                :label="item.size"
                :disabled="item.quantity < 1"
                ><p :class="item.quantity < 1 ? 'text-zinc-500' : 'text-white'">
                  {{ item.size }}
                </p></el-radio
              >
            </el-radio-group>
          </div>
        </div>
        <div class="flex flex-row items-center py-3">
          <p>Quantity</p>
          <div class="flex flex-row pl-16 pr-3">
            <el-input-number v-model="selected.quantity" :min="1" />
          </div>
        </div>
      </div>
      <div class="pt-6">
        <el-button :icon="ShoppingTrolley" size="large">Add to bag</el-button>
        <el-button type="danger" size="large" @click="BuyProduct"
          >Buy Now</el-button
        >
      </div>
    </div>
  </div>
  <div class="grid grid-cols-3 py-6">
    <div class="col-span-2 p-6 flex flex-col gap-6">
      <p class="text-2xl">Product detail</p>
      <el-image v-for="url in urls" :key="url" :src="url" lazy />
    </div>
    <div class="text-xl leading-10 p-6">
      Shipping* <br />
      To get accurate shipping information <br />
      Edit Location <br />
      Free Pickup Find a Store <br />
      *Faster Shipping options may be available <br />
      The radiance lives on in the Nike Air Force 1 ’07, the b-ball OG that puts
      a fresh spin on what you know best: durably stitched overlays, clean
      finishes and the perfect amount of flash to make you shine.
      <br />
      Shown: White/White <br />
      Style: CW2288-111 <br />
      <a href="#" class="underline">View Product Details</a>
    </div>
  </div>
</template>

<style>
.el-input__wrapper {
  background-color: rgb(255, 255, 255);
}
</style>
