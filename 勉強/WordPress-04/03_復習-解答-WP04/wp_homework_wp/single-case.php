<?php get_header(); ?>

<?php get_template_part('m_kv'); ?>

<main class="single-case">
    <div class="l_contents">
        <article class="l_container-xs">
            <?php
            if (have_posts()) :
                while (have_posts()) :
                    the_post();

                    // カスタムタクソノミー取得
                    $terms = get_the_terms(get_the_ID(), 'case'); // タクソノミー名
                    if ($terms && !is_wp_error($terms)) {
                        $term = $terms[0];
                        $cat_name = $term->name;
                        $cat_link = get_term_link($term);
                    } else {
                        $cat_name = '';
                        $cat_link = '';
                    }
            ?>

            <div class="single-case_thumb-wrapper">
                <?php the_post_thumbnail(null, array('class' => 'single-case_thumb')); ?>
            </div>

            <?php if ($cat_name): ?>
            <div class="single-case_meta">
                <a href="<?php echo esc_url($cat_link); ?>">
                    <?php echo esc_html($cat_name); ?>
                </a>
            </div>
            <?php endif; ?>

            <div class="single-case_content">
                <h1><?php the_title(); ?></h1>
                <?php the_content(); ?>
            </div>

            <?php
                endwhile;
            else:
            ?>
            <p>投稿データはありません</p>
            <?php endif; ?>
        </article>
    </div>
</main>

<?php get_template_part('cta'); ?>

<?php get_footer(); ?>