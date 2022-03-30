<script setup lang="ts">
import { ref } from 'vue'
import { changeTheme } from 'vite-plugin-element-theme/es/client.js'
import {
  ElButton,
  ElSwitch,
  ElNotification,
  ElSelect,
  ElRadioGroup,
  ElRadioButton,
  ElSlider,
  ElDatePicker,
} from 'element-plus'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
const radioVal = ref('New York')
const switchVal = ref(true)
const sliderVal = ref(50)
function onClick() {
  ElNotification({
    type: 'success',
    title: '已成功发送邮件',
    message: '验证码区分大小写，有效期5分钟',
    duration: 3000,
  })
}
function handleClick() {
  // changeTheme('test')
  changeTheme('default')
}
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
  <div class="container">
    <el-button @click="handleClick">切换主题色</el-button>
    <h1>Custom theme example (on demand)</h1>
    <h1>Custom theme example (on demand)</h1>

    <el-row>
      <el-button @click="onClick">Default</el-button>
      <!-- <el-button type="primary" @click="onClick">Primary</el-button> -->
      <el-button type="success" @click="onClick">Success11111111</el-button>
      <el-button type="info" @click="onClick">Info</el-button>
      <el-button type="warning" @click="onClick">Warning</el-button>
      <el-button type="danger" @click="onClick">Danger</el-button>
    </el-row>

    <el-row>
      <el-button @click="onClick">Default</el-button>
      <el-button type="primary" @click="onClick">Primary</el-button>
      <el-button type="success" @click="onClick">Success</el-button>
      <el-button type="info" @click="onClick">Info</el-button>
      <el-button type="warning" @click="onClick">Warning</el-button>
      <el-button type="danger" @click="onClick">Danger</el-button>
    </el-row>

    <el-radio-group v-model="radioVal">
      <el-radio-button label="New York"></el-radio-button>
      <el-radio-button label="Washington"></el-radio-button>
      <el-radio-button label="Los Angeles"></el-radio-button>
      <el-radio-button label="Chicago"></el-radio-button>
    </el-radio-group>

    <div>
      <el-switch v-model="switchVal"></el-switch>&nbsp;
      <el-switch
        v-model="switchVal"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </div>

    <div>
      <el-select>
        <el-option>test</el-option>
      </el-select>
      &nbsp;
      <el-date-picker></el-date-picker>
    </div>

    <el-slider v-model="sliderVal"></el-slider>

    <p>
      It is a example built by vite.&nbsp; More info see
      <a
        href="https://github.com/element-plus/unplugin-element-plus"
        target="_blank"
        >unplugin-element-plus</a
      >.
    </p>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
