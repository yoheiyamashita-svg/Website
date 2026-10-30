<?php get_header(); ?>


<?php get_template_part('m_kv'); ?>

<main class="l_main">
  <?php
  if (have_posts()):
    while (have_posts()):
      the_post();
  ?>
      <section class="case_section">
        <div class="l_contents">
          <a href="<?php the_permalink(); ?>" class="case_section-inner">
            <div class="case_section_wrapper">
              <?php the_post_thumbnail(null, array('class' => 'case_section_img')); ?>
            </div>
            <!-- /.case_section_wrapper -->
            <div class="case_section_content">
              <p class="case_section-num">
                <span class="case_section-num_icon"></span>
                CASE <?php echo $wp_query->current_post + 1; ?>
              </p>
              <h2 class="case_section_title">
                <?php the_title(); ?>
              </h2>
              <p class="case_section_txt">
                <?php
                if (mb_strlen($post->post_content, 'UTF-8') > 200) {
                  $content = str_replace('\n', '', mb_substr(strip_tags($post->post_content), 0, 200, 'UTF-8'));
                  echo $content . '…';
                } else {
                  echo str_replace('\n', '', strip_tags($post->post_content));
                }
                ?>
              </p>
              <p class="case_section_btn">詳しく見る<span class="case_section_btn_arrow">→</span></p>
            </div>
            <!-- /.case_section_content -->
          </a>
          <!-- /.case_section-inner -->
        </div>
        <!-- /.l_contents -->
      </section>

  <?php
    endwhile;
  endif;
  ?>

  <?php get_template_part('cta'); ?>
</main>

<?php get_footer(); ?>