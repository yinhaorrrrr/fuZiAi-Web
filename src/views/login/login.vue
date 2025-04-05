<script setup>
import { ref } from 'vue'
import { Login } from '@api/api_login.js'
import router from "@/router/router.js";
import {layer} from "@layui/layui-vue";
const password = ref('')
const username = ref('')

const handleLogin = async () => {
  Login({
    username: username.value,
    password: password.value
  }).then(res => {
    console.log(res)
    if(res.data.code === 1) {
      // 登陆成功，跳转到指定页面并弹出成功提示
      layer.msg("登陆成功", { icon : 1, time: 1000})
      router.push('/home')
    } else {
      // 登陆失败，弹出返回的失败信息
      layer.msg(`登陆失败: ${res.data.msg || '未知错误'}`, { icon : 2, time: 2000})
    }
  }).catch(error => {
    // 捕获登录请求错误，弹出提示
    layer.msg(`请求失败: ${error.message}`, { icon : 2, time: 1000});
  })

}
const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="body">
    <div class="login-container">
      <h2> 欢迎来到fuziai喵</h2>
        <div class="form-group">
          <label for="username">用户名:</label>
          <input type="text" id="username" name="username" placeholder="username" v-model="username">
        </div>

        <div class="form-group">
          <label for="password">密码:</label>
          <input type="password" id="password" name="password" placeholder="password" v-model="password">
        </div>

        <button type="submit" @click="handleLogin">登录</button>

      <div class="register-link">
        <a @click="goToRegister">注册账号</a>
      </div>

    </div>
  </div>
</template>

<style scoped>
.body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.login-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
  max-height: calc(300px * 1.618);
  overflow: hidden;
}

.login-container h2 {
  color: #333;
  margin-bottom: 20px;
}

.login-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  background-color: #4caf50;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}


.register-link {
  margin-top: 15px;
  text-align: right;
}

.register-link a {
  color: #666;
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;
}

.register-link a:hover {
  color: #4caf50;
  text-decoration: underline;
}
</style>