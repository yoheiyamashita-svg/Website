<?php get_header(); ?>

<?php get_template_part('m_kv'); ?>

<main class="l_main">

  <?php
  if (have_posts()):
    while (have_posts()):
      the_post();
  ?>

      <section class="single-case_section">
        <div class="l_contents">
          <div class="l_container-xs">
            <div class="single-case_section-inner">
              <div class="single-case_section_wrapper">
                <?php the_post_thumbnail(null, array('class' => 'single-case_section_img')); ?>
              </div>
              <!-- /.case_section_wrapper -->
              <div class="single-case_section_content">
                <h2 class="single-case_section_title">
                  <?php the_title(); ?>
                </h2>
                <div class="single-case_section_txt-content">
                  <?php the_content(); ?>
                </div>
                <!-- /.single-case_section_txt-content -->
              </div>
              <!-- /.case_section_content -->
            </div>
            <!-- /.case_section-inner -->
          </div>
          <!-- /.l_container-sm -->
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