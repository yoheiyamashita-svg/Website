<?php get_header(); ?>

<?php 
  if (have_posts()):
    while (have_posts()):
      the_post();
?>
<?php get_template_part('m_kv'); ?>


<main class="contact_main l_main">
    <div class="l_contents">
        <div class="l_container-sm">
            <?php the_content() ?>
        </div>
    </div>
    <!-- /.l_container-sm -->
</main>
<?php 
    endwhile;
  endif;
?>

<?php get_footer(); ?>