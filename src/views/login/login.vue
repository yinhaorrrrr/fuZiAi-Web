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
  font-family: "Segoe UI", "PingFang SC", sans-serif;
  background: linear-gradient(135deg, #c3e4ff 0%, #e3f5ff 100%);
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.login-container {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 30px 25px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  width: 320px;
  text-align: center;
}

.login-container h2 {
  color: #333;
  margin-bottom: 25px;
  font-size: 22px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 18px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 6px;
  color: #444;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 15px;
}

button {
  background: linear-gradient(to right, #4CAF50, #66BB6A);
  color: white;
  padding: 10px 0;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
  box-shadow: 0 4px 14px rgba(76, 175, 80, 0.4);
}

button:hover {
  background: linear-gradient(to right, #43A047, #66BB6A);
}

.register-link {
  margin-top: 18px;
  text-align: center;
}

.register-link a {
  color: #444;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.register-link a:hover {
  color: #43A047;
  text-decoration: underline;
}

</style>