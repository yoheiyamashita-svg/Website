<aside class="m_sidebar">
  <div class="m_sidebar-box">
    <div class="m_sidebar-box_head">
      <h2 class="m_sidebar-box_head-txt">カテゴリー</h2>
    </div>
    <!-- /.m_sidebar-box_head -->
    <div class="m_sidebar-box_contents">
      <ul class="m_sidebar-cat">
        <?php
        $cats = get_categories();
        foreach ($cats as $cat) :
          $cat_link = get_category_link($cat->term_id);
          $cat_count = $cat->count;
          $cat_name = $cat->cat_name;
        ?>
          <li class="m_sidebar-cat_item">
            <a href="<?php echo esc_url($cat_link); ?>" class="m_sidebar-cat_link">
              <p class="m_sidebar-cat_txt"><?php echo esc_html($cat_name); ?></p>
              <span class="m_sidebar-cat_count"><?php echo esc_html($cat_count); ?></span>
            </a>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
    <!-- /.m_sidebar-box_head -->
  </div>
  <!-- /.m_sidebar-box -->
  <div class="m_sidebar-box">
    <div class="m_sidebar-box_head">
      <h2 class="m_sidebar-box_head-txt">新着記事</h2>
    </div>
    <!-- /.m_sidebar-box_head -->
    <div class="m_sidebar-box_contents">
      <?php
      $args = array(
        'post_type' => 'post', //カスタム投稿タイプを指定
        'posts_per_page' => 4, //表示する記事数
      );

      $the_query = new WP_Query($args);
      if ($the_query->have_posts()):
        while ($the_query->have_posts()): $the_query->the_post();

          $cat = get_the_category();
          $cat_name = $cat[0]->name;
      ?>
          <article class="m_sidebar-post">
            <a href="<?php the_permalink(); ?>" class="m_sidebar-post_link">
              <!-- /.m_post_thumb-wrapper -->
              <div class="m_sidebar-post_content">
                <div class="m_sidebar-post_meta">
                  <time class="m_sidebar-post_meta-date"><?php the_time('Y.m.d'); ?></time>
                  <span class="m_sidebar-post_meta-cat"><?php echo esc_html($cat_name); ?></span>
                </div>
                <!-- ./m_post_meta -->
                <h2 class="m_sidebar-post_title">
                  <?php the_title(); ?>
                </h2>
              </div>
              <!-- /.m_post_content -->
            </a>
          </article>
        <?php endwhile; ?>
        <?php wp_reset_postdata(); ?>
      <?php endif; ?>
    </div>
    <!-- /.m_sidebar-box_head -->
  </div>
  <!-- /.m_sidebar-box -->
</aside>