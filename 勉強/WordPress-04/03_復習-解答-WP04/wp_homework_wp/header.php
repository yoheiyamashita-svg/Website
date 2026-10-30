<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>ZeroPlus</title>
    <meta name="description" content="スタートアップのデジタルマーケティングを徹底的にサポートする。" />
    <meta name="format-detection" content="telephone=no" />

    <!-- favicon/web-clip-icon -->
    <link rel="icon" href="<?php echo esc_url(get_template_directory_uri() . '/favicon.ico'); ?>" type="image/ico" />
    <link rel="icon" href="<?php echo esc_url(get_template_directory_uri() . '/favicon.png'); ?>" type="image/png" />
    <link rel="icon" href="<?php echo esc_url(get_template_directory_uri() . '/favicon.svg'); ?>"
        type="image/svg+xml" />
    <link rel="apple-touch-icon" href="<?php echo esc_url(get_template_directory_uri() . '/webclip.png'); ?>" />

    <!-- ogp -->
    <meta property="og:site_name" content="ZeroPlus" />
    <meta property="og:url" content="サイトのURL" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="ZeroPlus" />
    <meta property="og:description" content="スタートアップのデジタルマーケティングを徹底的にサポートする。" />
    <meta property="og:image" content="URL" />
    <meta property="og:locale" content="ja_JP" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:description" content="スタートアップのデジタルマーケティングを徹底的にサポートする。" />
    <meta name="twitter:image:src" content="URL" />
    <?php wp_head(); ?>
</head>

<body class="js_body">
    <header class="l_header">
        <?php
        if (is_front_page()) :
        ?>
        <h1 class="l_header-logo">
            <a href="<?php echo esc_url(home_url()); ?>" class="l_header-logo_link">ZeroPlus</a>
        </h1>
        <?php else : ?>
        <p class="l_header-logo">
            <a href="<?php echo esc_url(home_url()); ?>" class="l_header-logo_link">ZeroPlus</a>
        </p>
        <?php endif; ?>

        <nav class="l_header-nav js_nav">
            <ul class="l_header-nav_list">
                <li class="l_header-nav_item">
                    <a href="<?php echo esc_url(home_url()); ?>" class="l_header-nav_link">トップ</a>
                </li>
                <li class="l_header-nav_item">
                    <a href="<?php echo esc_url(home_url('/about')); ?>" class="l_header-nav_link">私たちについて</a>
                </li>
                <li class="l_header-nav_item">
                    <a href="<?php echo esc_url(home_url('/service')); ?>" class="l_header-nav_link">サービス</a>
                </li>
                <li class="l_header-nav_item">
                    <a href="<?php echo esc_url(get_post_type_archive_link('case')); ?>"
                        class="l_header-nav_link">事例</a>
                </li>
                <li class="l_header-nav_item">
                    <a href="<?php echo esc_url(home_url('/blog')); ?>" class="l_header-nav_link" target="_blank"
                        rel="noopener noreferrer">ブログ</a>
                </li>
                <li class="l_header-nav_item">
                    <a href="<?php echo esc_url(home_url('/contact')); ?>" class="l_header-nav_link">お問い合わせ</a>
                </li>
            </ul>
        </nav>

        <button class="m_hamburger js_hamburger">
            <span class="m_hamburger-bar js_hamburger-bar"></span>
            <span class="m_hamburger-bar js_hamburger-bar"></span>
            <span class="m_hamburger-bar js_hamburger-bar"></span>
        </button>
    </header>