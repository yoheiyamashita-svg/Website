<?php get_header(); ?>

<?php
if (have_posts()) :
  while (have_posts()) :
    the_post();
?>

    <?php get_template_part('m_kv'); ?>

    <main class="single-case">
      <div class="l_contents">
        <div class="l_container-xs">
          <div class="single-case_thumb-wrapper">
            <?php the_post_thumbnail(null, array('class' => 'single-case_thumb')); ?>
          </div>
          <!-- /.single-case_thumb-wrapper -->

          <div class="single-case_content">
            <h1>
              <?php the_title(); ?>
            </h1>
            <?php the_content(); ?>
          </div>
          <!-- /.single-case_content -->
        </div>
        <!-- .l_container-xs -->
      </div>
      <!-- /.l_contents -->
    </main>

    <?php get_template_part('cta'); ?>

<?php
  endwhile;
endif;
?>

<?php get_footer(); ?>