<!-- ブログヘッダーのテンプレートパーツファイル -->
<!doctype html>
<html lang="ja">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>ZeroPlus Blog</title>
  <meta
    name="description"
    content="ZeroPlus Blogはスタートアップ経営者のための、マーケティングに関するノウハウを発信するメディアです。" />
  <meta name="format-detection" content="telephone=no" />
  <!-- favicon/web-clip-icon -->
  <link rel="icon" href="<?php echo esc_url(get_template_directory_uri() . '/favicon.ico'); ?>" type="image/ico" />
  <link rel="icon" href="<?php echo esc_url(get_template_directory_uri() . '/favicon.png'); ?>" type="image/png" />
  <link rel="icon" href="<?php echo esc_url(get_template_directory_uri() . '/favicon.svg'); ?>" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="<?php echo esc_url(get_template_directory_uri() . '/webclip.png'); ?>" />
  <!-- ogp -->
  <meta property="og:site_name" content="ZeroPlus Blog" />
  <meta
    property="og:url"
    content="https://zero-plus.io/lesson/ogp/blog_ogp.jpg" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="ZeroPlus Blog" />
  <meta
    property="og:description"
    content="ZeroPlus Blogはスタートアップ経営者のための、マーケティングに関するノウハウを発信するメディアです。" />
  <meta
    property="og:image"
    content="https://zero-plus.io/lesson/ogp/blog_ogp.jpg" />
  <meta property="og:locale" content="ja_JP" />
  <!-- <meta property="fb:app_id" content="AppID"> -->
  <meta name="twitter:card" content="summary_large_image" />
  <!-- <meta name="twitter:site" content="" /> -->
  <meta
    name="twitter:description"
    content="ZeroPlus Blogはスタートアップ経営者のための、マーケティングに関するノウハウを発信するメディアです。" />
  <meta
    name="twitter:image:src"
    content="https://zero-plus.io/lesson/ogp/blog_ogp.jpg" />
  <?php wp_head(); ?>
</head>

<body>
  <header class="l_header">
    <p class="l_header-logo">
      <a href="<?php echo esc_url(home_url('/blog')); ?>" class="l_header-logo_link">ZeroPlus</a>
    </p>
    <nav class="l_header-nav">
      <ul class="l_header-nav_list">
        <li class="l_header-nav_item">
          <a href="" class="l_header-nav_link">マーケティング</a>
        </li>
        <li class="l_header-nav_item">
          <a href="" class="l_header-nav_link">グロースハック</a>
        </li>
        <li class="l_header-nav_item">
          <a href="" class="l_header-nav_link">SEO</a>
        </li>
        <li class="l_header-nav_item">
          <a href="" class="l_header-nav_link">運用型広告</a>
        </li>
        <li class="l_header-nav_item">
          <a href="" class="l_header-nav_link">SNSマーケ</a>
        </li>
        <li class="l_header-nav_item">
          <a href="<?php echo esc_url(home_url()); ?>" class="l_header-nav_link">運営会社</a>
        </li>
      </ul>
    </nav>
  </header>