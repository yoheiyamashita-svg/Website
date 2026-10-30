<!doctype html>
<html lang="ja">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>ZeroPlus Corporate</title>
  <meta
    name="description"
    content="スタートアップのためのデジタルマーケティングを支援" />
  <meta name="format-detection" content="telephone=no" />
  <!-- favicon/web-clip-icon -->
  <link rel="icon" href="<?php echo esc_url(get_template_directory_uri() . '/favicon.ico'); ?>" type="image/ico" />
  <link rel="icon" href="<?php echo esc_url(get_template_directory_uri() . '/favicon.png'); ?>" type="image/png" />
  <link rel="icon" href="<?php echo esc_url(get_template_directory_uri() . '/favicon.svg'); ?>" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="<?php echo esc_url(get_template_directory_uri() . '/webclip.png'); ?>" />
  <!-- ogp -->
  <meta property="og:site_name" content="ZeroPlus Corporate" />
  <meta
    property="og:url"
    content="https://zero-plus.io/lesson/ogp/hp_ogp.jpg" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="ZeroPlus Corporate" />
  <meta
    property="og:description"
    content="スタートアップのためのデジタルマーケティングを支援" />
  <meta
    property="og:image"
    content="https://zero-plus.io/lesson/ogp/hp_ogp.jpg" />
  <meta property="og:locale" content="ja_JP" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:description"
    content="スタートアップのためのデジタルマーケティングを支援" />
  <meta
    name="twitter:image:src"
    content="https://zero-plus.io/lesson/ogp/hp_ogp.jpg" />
  <?php wp_head(); ?>
</head>

<body class="js_body">
  <header class="l_header">
    <h1 class="l_header-logo">
      <a href="<?php echo esc_url(home_url()); ?>" class="l_header-logo_link">ZeroPlus</a>
    </h1>
    <nav class="l_header-nav js_navigation">
      <ul class="l_header-nav_list">
        <li class="l_header-nav_item">
          <a href="<?php echo esc_url(home_url()); ?>" class="l_header-nav_link">トップ</a>
        </li>
        <li class="l_header-nav_item">
          <a href="" class="l_header-nav_link">サービス</a>
        </li>
        <li class="l_header-nav_item">
          <a href="" class="l_header-nav_link">事例</a>
        </li>
        <li class="l_header-nav_item">
          <a href="" class="l_header-nav_link">会社概要</a>
        </li>
        <li class="l_header-nav_item">
          <a href="<?php echo esc_url(home_url('/blog')); ?>" class="l_header-nav_link">ブログ</a>
        </li>
        <li class="l_header-nav_item">
          <a href="" class="l_header-nav_link">お問い合わせ</a>
        </li>
      </ul>
    </nav>
    <button class="m_hamburger js_hamburger">
      <span class="m_hamburger-bar"></span>
      <span class="m_hamburger-bar"></span>
      <span class="m_hamburger-bar"></span>
    </button>
  </header>