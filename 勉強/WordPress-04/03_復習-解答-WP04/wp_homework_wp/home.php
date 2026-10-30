<?php get_header('blog'); ?>

    <div class="l_wrapper">
      <h1 class="m_page-title m_page-title__primary-color">ZeroPlusブログ</h1>
      <p class="m_page-title-sub">スタートアップ経営者のためのメディア</p>
      <div class="l_contents-warp l_container">
        <main class="l_main">
          <div class="m_posts">
            <?php 
            if (have_posts()) :
              while (have_posts()) :
                the_post();

                  $cat = get_the_category();
                  $cat_name = $cat[0]->name;
            ?>
            <article class="m_post">
              <a href="<?php the_permalink(); ?>" class="m_post_link">
                <div class="m_post_thumb-wrapper">
                  <?php the_post_thumbnail(null, array('class' => 'm_post_thumb')); ?>
                </div>
                <!-- /.m_post_thumb-wrapper -->
                <div class="m_post_content">
                  <div class="m_post_meta">
                    <time class="m_post_meta-date"><?php the_time('Y.m.d'); ?></time>
                    <span class="m_post_meta-cat">
                      <?php echo esc_html($cat_name); ?>
                    </span>
                  </div>
                  <!-- ./m_post_meta -->
                  <h2 class="m_post_title">
                    <?php the_title(); ?>
                  </h2>
                </div>
                <!-- /.m_post_content -->
              </a>
            </article>
            <?php
              endwhile;
            else:
            ?>
            <p>投稿データはありません</p>
            <?php endif; ?>
          </div>
          <!-- /.m_posts -->
          <?php 
            the_posts_pagination(array(
              'screen_reader_text' => ' ',
              'prev_text' => '',
              'next_text' => ''
            )); 
          ?>
          <!-- /.pagination -->
        </main>
        <?php get_sidebar(); ?>
      </div>
      <!-- l_contents-warp -->
    </div>
    <!-- /.l_wrapper -->

<?php get_footer('blog'); ?>