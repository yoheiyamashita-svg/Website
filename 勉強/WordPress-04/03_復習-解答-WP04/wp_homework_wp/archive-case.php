<?php get_header(); ?>

<?php get_template_part('m_kv'); ?>

<main class="case_main">
    <div class="l_container">
        <div class="l_contents">

            <?php 
    if (have_posts()):
      while (have_posts()):
        the_post();
    ?>

            <a href="<?php the_permalink(); ?>" class="case_item">
                <div class="case_item_img-wrapper">
                    <?php the_post_thumbnail(null, array('class' => 'case_item_img')); ?>
                </div>
                <!-- /.case_item_img-wrapper -->
                <div class="case_item_txt-wrapper">
                    <span class="case_item_num"> <?php echo $wp_query->current_post + 1; ?>.</span>
                    <h2 class="case_item_title">
                        <?php the_title(); ?>
                    </h2>
                    <p class="case_item_desc">
                        <?php
            if(mb_strlen($post->post_content,'UTF-8')>75){
              $content= str_replace('\n', '', mb_substr(strip_tags($post-> post_content), 0, 75,'UTF-8'));
              echo $content.'…';
            }else{
              echo str_replace('\n', '', strip_tags($post->post_content));
            }
          ?>
                    </p>
                    <p class="case_item_more">続きを読む</p>
                </div>
                <!-- /.case_item_txt-wrapper -->
            </a>
            <!-- /.case_item -->

            <?php 
      endwhile;
    endif;
    ?>
        </div><!-- /.l_contents -->
    </div>
    <!-- /.l_container -->
</main>

<?php get_template_part('cta'); ?>

<?php get_footer(); ?>