<?php

// アイキャッチ画像の有効化
add_theme_support('post-thumbnails');

// cssの読み込み
add_action('wp_enqueue_scripts', 'add_styles');
function add_styles()
{

  // google fonts
  wp_enqueue_style('google-fonts_style', 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');

  // reset style
  wp_register_style(
    'reset_style', // 登録する識別名
    get_template_directory_uri() . '/css/reset.css', // 登録するCSSのパス
    array(), // CSSの依存先
    '1.0' // パラメータの付与（スタイルの変更に合わせて変更することで、キャッシュを防ぐことができる）
  );

  // コーポレートにのみ読み込ませる
  if (is_front_page()) {
    // corporate style（コーポレートサイトのスタイル）
    wp_enqueue_style(
      'corporate_style',
      get_template_directory_uri() . '/css/corporate.css',
      array('reset_style'),
      '1.0'
    );
  } else {
    // ブログに読み込ませる
    // blog style（ブログサイトのスタイル）
    wp_enqueue_style(
      'blog_style',
      get_template_directory_uri() . '/css/blog.css',
      array('reset_style'),
      '1.0'
    );
  }
}
