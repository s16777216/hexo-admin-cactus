---
title: 登入
date: 2025-08-25 20:50:43
type: login
---

<div class="login-container">
  <h2>Login</h2>
  <form id="login-form">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" required>
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" required>
    <button type="submit">Login</button>
  </form>
  <p id="message"></p>
</div>

<script>
document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // 阻止表單預設提交行為

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const messageEl = document.getElementById('message');

  try {
    const response = await fetch('http://localhost:4001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      messageEl.style.color = 'green';
      messageEl.textContent = '登入成功！' + data.message;
      // 這裡可以導向其他頁面或儲存 token
    } else {
      messageEl.style.color = 'red';
      messageEl.textContent = '登入失敗：' + data.message;
    }
  } catch (error) {
    messageEl.style.color = 'red';
    messageEl.textContent = '連線錯誤，請稍後再試。';
    console.error('Error:', error);
  }
});
</script>