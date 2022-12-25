<template>
  <el-container class="min-h-[100vh] bg-gray-800 text-cyan-50">
    <el-header
      class="flex items-center text-3xl font-semibold border-b-[1px] border-cyan-300/30"
    >
      <div class="flex flex-row justify-between items-center w-full">
        <p>Clothing Store</p>
        <el-popover placement="top-start" :width="150" trigger="hover">
          <template #reference>
            <div class="flex items-center space-x-2 cursor-pointer">
              <el-icon><Avatar /></el-icon>
              <p class="text-lg">Admin</p>
            </div>
          </template>
          <template #default>
            <div class="w-full flex flex-col text-lg">
              <a class="cursor-pointer hover:font-bold">Profile</a>
              <a class="cursor-pointer hover:font-bold" @click="logout"
                >Logout</a
              >
            </div>
          </template>
        </el-popover>
      </div>
    </el-header>
    <el-container>
      <el-aside class="sidebar border-r-[1px] border-cyan-600/30">
        <nav class="nav">
          <ul>
            <li
              v-for="page in listPage"
              :key="page.id"
              :class="path == page.path ? 'active' : ''"
            >
              <a :href="page.path">{{ page.label }}</a>
            </li>
          </ul>
        </nav>
      </el-aside>
      <el-main><RouterView /></el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import { Avatar } from "@element-plus/icons-vue";
const path = window.location.pathname;
const route = useRouter();
const listPage = [
  { id: "1", path: "/product", label: "All product" },
  { id: "2", path: "/test", label: "For man" },
  { id: "3", path: "#women", label: "For women" },
  { id: "4", path: "#child", label: "For child" },
  { id: "4", path: "#other", label: "Other" },
];
const logout = () => {
  localStorage.removeItem("token");
  route.push("/login");
};
</script>

<style lang="scss">
.sidebar {
  width: 240px;
  background: #312450;
  font-size: 0.65em;
}
.nav {
  position: relative;
  margin: 0 15%;
  text-align: right;
  top: 200px;
  transform: translateY(-50%);
  font-weight: bold;
}

.nav ul {
  list-style: none;

  li {
    position: relative;
    margin: 3.2em 0;

    a {
      line-height: 5em;
      text-transform: uppercase;
      text-decoration: none;
      letter-spacing: 0.4em;
      color: rgba(#fff, 0.35);
      display: block;
      transition: all ease-out 300ms;
    }

    &.active a {
      color: white;
    }

    &:not(.active)::after {
      opacity: 0.2;
    }

    &:not(.active):hover a {
      color: rgba(#fff, 0.75);
    }

    &::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 0.2em;
      background: black;
      left: 0;
      bottom: 0;
      background-image: linear-gradient(to right, #5e42a6, #b74e91);
    }
  }
}
</style>
