<?php get_header(); ?>


<?php get_template_part('m_kv'); ?>


<main class="case_main">
  <div class="l_container">
    <div class="l_contents">
      <?php
      if (have_posts()) :
        while (have_posts()) :
          the_post();
      ?>
          <a href="<?php the_permalink(); ?>" class="case_unit">
            <div class="case_unit_img-wrapper">
              <?php the_post_thumbnail(null, array('class' => 'case_unit_img')); ?>
            </div>
            <!-- /.case_unit_img-wrapper -->
            <div class="case_unit_txts">
              <span class="case_unit_num"> <?php echo $wp_query->current_post + 1; ?>. </span>
              <h2 class="case_unit_heading">
                <?php the_title(); ?>
              </h2>
              <p class="case_unit_desc">
                <?php
                if (mb_strlen($post->post_content, 'UTF-8') > 200) {
                  $content = str_replace('\n', '', mb_substr(strip_tags($post->post_content), 0, 200, 'UTF-8'));
                  echo $content . '…';
                } else {
                  echo str_replace('\n', '', strip_tags($post->post_content));
                }
                ?>
              </p>
              <p class="case_unit_more">続きを読む</p>
            </div>
            <!-- /.case_unit_txts -->
          </a>
          <!-- /.case_unit -->
      <?php
        endwhile;
      endif;
      ?>
    </div>
    <!-- .l_contents -->
  </div>
  <!-- /.l_contaier -->
</main>

<?php get_template_part('cta'); ?>

<?php get_footer(); ?>