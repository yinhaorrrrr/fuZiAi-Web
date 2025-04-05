<script setup>
import { ref } from 'vue'
import router from "@/router/router.js";
import { layer } from "@layui/layui-vue";

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const email = ref('')
const verificationCode = ref('')

const handleRegister = () => {
  // 简单的表单验证
  if (!username.value || !password.value || !confirmPassword.value || !email.value || !verificationCode.value) {
    layer.msg("请填写所有字段", { icon: 2, time: 2000 });
    return;
  }

  if (password.value !== confirmPassword.value) {
    layer.msg("两次输入的密码不一致", { icon: 2, time: 2000 });
    return;
  }

  // 这里应该是调用注册API的逻辑
  layer.msg("注册成功", { icon: 1, time: 1000 });
  setTimeout(() => {
    router.push('/login'); // 注册成功后跳转到登录页
  }, 1000);
}

const sendVerificationCode = () => {
  if (!email.value) {
    layer.msg("请输入邮箱地址", { icon: 2, time: 2000 });
    return;
  }

  // 这里应该是调用发送验证码API的逻辑
  layer.msg("验证码已发送至邮箱", { icon: 1, time: 2000 });
}
</script>

<template>
  <div class="body">
    <div class="register-container">
      <h2>注册新账号</h2>
      <div class="form-group">
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="username" placeholder="请输入用户名">
      </div>

      <div class="form-group">
        <label for="email">邮箱:</label>
        <input type="email" id="email" v-model="email" placeholder="请输入邮箱">
      </div>

      <div class="form-group verification-group">
        <label for="verification-code">验证码:</label>
        <div class="verification-input">
          <input type="text" id="verification-code" v-model="verificationCode" placeholder="请输入验证码">
          <button class="verification-btn" @click="sendVerificationCode">获取验证码</button>
        </div>
      </div>

      <div class="form-group">
        <label for="password">密码:</label>
        <input type="password" id="password" v-model="password" placeholder="请输入密码">
      </div>

      <div class="form-group">
        <label for="confirm-password">确认密码:</label>
        <input type="password" id="confirm-password" v-model="confirmPassword" placeholder="请再次输入密码">
      </div>

      <button type="submit" class="register-btn" @click="handleRegister">注册</button>

      <div class="login-link">
        已有账号？<a @click="router.push('/login')">去登录</a>
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

.register-container {
  background-color: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 320px;
  text-align: center;
}

.register-container h2 {
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}

.verification-group {
  margin-bottom: 20px;
}

.verification-input {
  display: flex;
  gap: 10px;
}

.verification-input input {
  flex: 1;
}

.verification-btn {
  background-color: #f0f0f0;
  color: #666;
  padding: 0 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 12px;
}

.verification-btn:hover {
  background-color: #e0e0e0;
}

.register-btn {
  background-color: #4caf50;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  margin-top: 10px;
}

.register-btn:hover {
  background-color: #45a049;
}

.login-link {
  margin-top: 15px;
  font-size: 14px;
  color: #666;
}

.login-link a {
  color: #4caf50;
  text-decoration: none;
  cursor: pointer;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>