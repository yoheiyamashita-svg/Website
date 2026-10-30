<?php get_header('blog'); ?>

<div class="l_wrapper">
  <div class="l_contents-warp l_container">
    <main class="l_main single_main">
      <article class="l_container-sm single">
        <?php
        if (have_posts()) :
          while (have_posts()) :
            the_post();
            $cat = get_the_category()[0];
            $cat_name = $cat->cat_name;
            $cat_link = get_category_link($cat->term_id);
        ?>
            <div class="single_main_thumb-wrapper">
              <?php the_post_thumbnail(null, array('class' => 'single_main_thumb')); ?>
            </div>
            <!-- /.single_main_thumb-wrapper -->
            <div class="single_main_meta">
              <div class="m_post_meta">
                <time class="m_post_meta-date"><?php the_time('Y.m.d'); ?></time>
                <a href="<?php echo esc_url($cat_link); ?>" class="m_post_meta-cat"><?php echo esc_html($cat_name); ?></a>
              </div>
              <!-- /.m_post_meta -->
            </div>
            <!-- /.single_main_meta -->
            <div class="single_main_content">
              <h1>
                <?php the_title(); ?>
              </h1>
              <?php the_content(); ?>
            </div>
          <?php
          endwhile;
        else:
          ?>
          <p>投稿データはありません</p>
        <?php endif; ?>
        <!-- /.single_main_content -->
      </article>
    </main>
    <?php get_sidebar(); ?>
  </div>
  <!-- /.l_contents-warp -->
</div>

<?php get_footer('blog'); ?>