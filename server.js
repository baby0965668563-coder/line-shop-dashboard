const express = require('express');
<html lang="zh-TW">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>LINE 賣場後台</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="/css/style.css"/>
</head>
<body>

<!-- ── SIDEBAR ── -->
<aside class="sidebar">
  <div class="sidebar-logo">
    <span class="logo-icon">🌸</span>
    <span class="logo-text" id="sidebarStoreName">賣場後台</span>
  </div>
  <nav class="sidebar-nav">
    <a href="#" class="nav-item active" data-page="ledger">
      <span class="nav-icon">📋</span><span>對帳</span>
    </a>
    <a href="#" class="nav-item" data-page="reorder">
      <span class="nav-icon">📦</span><span>叫貨</span>
    </a>
    <a href="#" class="nav-item" data-page="pricing">
      <span class="nav-icon">🏷️</span><span>價格</span>
    </a>
    <a href="#" class="nav-item" data-page="settings">
      <span class="nav-icon">⚙️</span><span>設定</span>
    </a>
  </nav>
  <div class="sidebar-footer">
    <span class="version-tag">v1.0</span>
  </div>
</aside>

<!-- ── MAIN ── -->
<main class="main-content">

  <!-- TOPBAR -->
  <header class="topbar">
    <div class="topbar-left">
      <h1 class="page-title" id="pageTitle">對帳</h1>
    </div>
    <div class="topbar-right">
      <div class="topbar-time" id="topbarTime"></div>
    </div>
  </header>

  <!-- PAGE: LEDGER 對帳 -->
  <section class="page active" id="page-ledger">

    <!-- 智慧抓單 -->
    <div class="card parse-card">
      <div class="card-header">
        <h2 class="card-title">✨ 智慧抓單辨識</h2>
        <p class="card-sub">貼上客人傳來的訂單文字，系統自動解析</p>
      </div>
      <textarea id="parseInput" class="parse-textarea" placeholder="例如：&#10;姓名：王小明&#10;DOG-M × 2&#10;KIT-S × 1&#10;Line ID: @wang123"></textarea>
      <div class="parse-actions">
        <button class="btn btn-primary" onclick="parseOrder()">🔍 智慧抓單辨識</button>
        <button class="btn btn-ghost" onclick="clearParse()">清除</button>
      </div>
    </div>

    <!-- 搜尋列 -->
    <div class="toolbar">
      <input type="text" class="search-input" id="orderSearch" placeholder="🔍 搜尋客人名字或 LINE ID…" oninput="renderOrders()"/>
      <div class="filter-tabs">
        <button class="filter-tab active" data-filter="all"    onclick="setFilter('all',this)">全部</button>
        <button class="filter-tab"        data-filter="pending"   onclick="setFilter('pending',this)">待對帳</button>
        <button class="filter-tab"        data-filter="done"      onclick="setFilter('done',this)">已結單</button>
        <button class="filter-tab"        data-filter="shipped"   onclick="setFilter('shipped',this)">已寄出</button>
      </div>
    </div>

    <!-- 訂單卡片列表 -->
    <div id="orderList" class="order-grid"></div>
  </section>

  <!-- PAGE: REORDER 叫貨 -->
  <section class="page" id="page-reorder">
    <div class="card">
      <div class="card-header between">
        <div>
          <h2 class="card-title">📦 叫貨統計</h2>
          <p class="card-sub">彙整「待對帳」與「已結單」的所有商品需求量</p>
        </div>
        <button class="btn btn-primary" onclick="exportReorder()">⬇ 匯出叫貨清單</button>
      </div>
      <div id="reorderTable" class="table-wrap"></div>
      <div id="reorderTotal" class="reorder-total"></div>
    </div>
  </section>

  <!-- PAGE: PRICING 價格 -->
  <section class="page" id="page-pricing">
    <div class="card">
      <div class="card-header between">
        <div>
          <h2 class="card-title">🏷️ 商品價格管理</h2>
          <p class="card-sub">新增、修改、刪除商品資料</p>
        </div>
        <button class="btn btn-primary" onclick="openProductModal()">＋ 新增商品</button>
      </div>
      <div id="productTable" class="table-wrap"></div>
    </div>
  </section>

  <!-- PAGE: SETTINGS 設定 -->
  <section class="page" id="page-settings">
    <div class="card settings-card">
      <div class="card-header">
        <h2 class="card-title">⚙️ 系統設定</h2>
        <p class="card-sub">LINE Bot 連線與基本資料</p>
      </div>
      <div class="settings-form">
        <div class="field-group">
          <label class="field-label">店家名稱</label>
          <input id="s-storeName" type="text" class="field-input" placeholder="我的 LINE 賣場"/>
        </div>
        <div class="field-group">
          <label class="field-label">LINE Channel Access Token</label>
          <input id="s-token" type="password" class="field-input" placeholder="Channel Access Token"/>
        </div>
        <div class="field-group">
          <label class="field-label">LINE Channel Secret</label>
          <input id="s-secret" type="password" class="field-input" placeholder="Channel Secret"/>
        </div>
        <div class="field-group">
          <label class="field-label">Webhook URL（複製到 LINE Developers）</label>
          <div class="webhook-row">
            <input id="s-webhook" type="text" class="field-input" readonly/>
            <button class="btn btn-ghost" onclick="copyWebhook()">複製</button>
          </div>
        </div>
        <button class="btn btn-primary" onclick="saveSettings()">💾 儲存設定</button>
      </div>
    </div>
  </section>

</main>

<!-- ── MODAL：新增 / 編輯商品 ── -->
<div class="modal-backdrop" id="productModal" onclick="closeProductModal(event)">
  <div class="modal-box">
    <div class="modal-header">
      <h3 id="modalTitle">新增商品</h3>
      <button class="modal-close" onclick="closeProductModal()">✕</button>
    </div>
    <div class="modal-body">
      <input type="hidden" id="m-id"/>
      <div class="field-group">
        <label class="field-label">商品代號</label>
        <input id="m-code" type="text" class="field-input" placeholder="例：DOG-M"/>
      </div>
      <div class="field-group">
        <label class="field-label">商品名稱</label>
        <input id="m-name" type="text" class="field-input" placeholder="例：大耳狗喜拿 毛絨玩偶 M款"/>
      </div>
      <div class="fields-row">
        <div class="field-group">
          <label class="field-label">售價（$）</label>
          <input id="m-price" type="number" class="field-input" placeholder="590"/>
        </div>
        <div class="field-group">
          <label class="field-label">運費（$）</label>
          <input id="m-shipping" type="number" class="field-input" placeholder="60"/>
        </div>
      </div>
      <div class="field-group">
        <label class="field-label">狀態</label>
        <select id="m-status" class="field-input">
          <option value="instock">✅ 現貨</option>
          <option value="preorder">⏳ 預購</option>
          <option value="soldout">❌ 售完</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeProductModal()">取消</button>
      <button class="btn btn-primary" onclick="saveProduct()">儲存</button>
    </div>
  </div>
</div>

<!-- ── TOAST ── -->
<div class="toast" id="toast"></div>

<script src="/js/app.js"></script>
</body>
</html>
