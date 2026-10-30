<?php get_header(); ?>

<!-- 
    オープニングアニメーション
    リロードするたびに発火すると開発の妨げになるためコメントアウトしています。
    全ての制作が終わったらコメントアウトを外してください。
-->
<!-- <div class="m_opening js_opening">
    <div class="m_opening_txt js_opening-txt">
        <p class="m_opening_heading">ZeroPlus</p>
        <p class="m_opening_desc">
        スタートアップの<br />
        デジタルマーケティングを<br />
        徹底的にサポートする。
        </p>
    </div>
</div> -->

<div class="top_kv">
    <div class="top_kv-inner l_container">
        <div class="top_kv_box">
            <p class="top_kv_sub-copy js_sub-copy">
                START UP FOR DIGITAL MARKETING.
            </p>
            <p class="top_kv_copy js_copy">
                スタートアップの<br />
                デジタルマーケティングを<br />
                徹底的にサポートする。
            </p>
            <div class="m_btn-wrapper top_kv_btn-wrapper">
                <a href="<?php echo esc_url(home_url('/contact')); ?>" class=" m_btn m_btn__mail">
                    無料で相談する
                </a>
            </div>
            <!-- /.top_kv_btn-wrapper -->
        </div>
        <!-- /.top_kv_box -->
        <div class="top_kv-scroll-down">
            <span class="top_kv-scroll-down_txt">SCROLL</span>
            <div class="top_kv-scroll-down_arrow"></div>
            <!-- /.top_kv-scroll-down_arrow -->
        </div>
        <!-- /.top_kv-scroll-down -->
    </div>
    <!-- /.top_kv-inner -->
</div>
<!-- /.kv -->
<div class="top_kv-slideshow js_slideshow">
    <div class="swiper-wrapper">
        <div class="top_kv-slideshow_slide swiper-slide">
            <img class="top_kv-slideshow_slide_img"
                src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/bg_kv.jpg'); ?>" alt="" />
        </div>
        <div class="top_kv-slideshow_slide swiper-slide">
            <img class="top_kv-slideshow_slide_img"
                src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/bg_kv02.jpg'); ?>" alt="" />
        </div>
        <div class="top_kv-slideshow_slide swiper-slide">
            <img class="top_kv-slideshow_slide_img"
                src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/bg_kv03.jpg'); ?>" alt="" />
        </div>
        <div class="top_kv-slideshow_slide swiper-slide">
            <img class="top_kv-slideshow_slide_img"
                src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/bg_kv04.jpg'); ?>" alt="" />
        </div>
        <div class="top_kv-slideshow_slide swiper-slide">
            <img class="top_kv-slideshow_slide_img"
                src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/bg_kv05.jpg'); ?>" alt="" />
        </div>
    </div>
</div>

<main class="l_main">
    <section class="top_about">
        <div class="l_contents">
            <div class="l_container">
                <h2 class="top_section_title top_section_title__about">私たちについて</h2>

                <div class="top_about_body">
                    <div class="top_about_contents">
                        <div class="top_about_img-wrapper">
                            <img src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/img_about-us.jpg'); ?>"
                                alt="オフィスでチームと一緒に働くビジネスウーマン。後ろでは複数の同僚がミーティングや作業をしている。" width="768" height="576"
                                class="top_about_img" />
                        </div>
                        <!-- /.top_about_img-wrapper -->
                        <div class="top_about_txt-wrapper">
                            <h2 class="top_about_heading">
                                スタートアップの<br />
                                デジタルマーケティングを<br />
                                全力で支援する会社です。
                            </h2>
                            <p class="top_about_desc">
                                親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。親譲りの無鉄砲で小供の時から損ばかりしている。
                            </p>
                        </div>
                        <!-- /.top_about_txt-wrapper -->
                    </div>
                    <!-- /.top_about_contents -->

                    <div class="m_btn-wrapper top_section_btn-wrapper ">
                        <a href="<?php echo esc_url(home_url('/about')); ?>" class="m_btn  m_btn__more">
                            詳しく見る
                        </a>
                    </div>
                    <!-- /.m_btn-wrapper -->
                </div>
                <!-- /.top_about_body -->
            </div>
        </div>
        <!-- /.l_contents -->
    </section>

    <section class="top_service">
        <div class="l_contents js_service-trigger">
            <div class="l_container">
                <h2 class="top_section_title top_section_title__service">サービス</h2>
                <div class="top_service_body">
                    <p class="top_service_desc">
                        親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。
                    </p>
                    <ul class="m_service_list">
                        <li class="m_service_item js_service">
                            <div class="m_service_item__circle">
                                <div class="m_service_item-icon-wrapper">
                                    <img src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/icon_service.svg'); ?>"
                                        alt="マーケティング支援" width="100" height="100" class="m_service_item-icon" />
                                </div>
                            </div>
                            <!-- /.m_service_item-icon-wrapper -->
                            <p class="m_service_item_name">マーケティング支援</p>
                        </li>
                        <!-- /.m_service_item -->
                        <li class="m_service_item js_service">
                            <div class="m_service_item__circle">
                                <div class="m_service_item-icon-wrapper">
                                    <img src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/icon_service02.svg'); ?>"
                                        alt="webサイト制作" width="100" height="100" class="m_service_item-icon" />
                                </div>
                            </div>
                            <!-- /.m_service_item-icon-wrapper -->
                            <p class="m_service_item_name">webサイト制作</p>

                        </li>
                        <!-- /.m_service_item -->
                        <li class="m_service_item js_service">
                            <div class="m_service_item__circle">
                                <div class="m_service_item-icon-wrapper">
                                    <img src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/icon_service03.svg'); ?>"
                                        alt="SEO対策支援" width="100" height="100" class="m_service_item-icon" />
                                </div>
                            </div>
                            <!-- /.m_service_item-icon-wrapper -->
                            <p class="m_service_item_name">SEO対策支援</p>
                        </li>
                        <!-- /.m_service_item -->
                        <li class="m_service_item js_service">
                            <div class="m_service_item__circle">
                                <div class="m_service_item-icon-wrapper">
                                    <img src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/icon_service04.svg'); ?>"
                                        alt="広告効果測定" width="100" height="100" class="m_service_item-icon" />
                                </div>
                            </div>
                            <!-- /.m_service_item-icon-wrapper -->
                            <p class="m_service_item_name">広告効果測定</p>
                        </li>
                        <!-- /.m_service_item -->
                        <li class="m_service_item js_service">
                            <div class="m_service_item__circle">
                                <div class="m_service_item-icon-wrapper">
                                    <img src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/icon_service05.svg'); ?>"
                                        alt="アクセス解析代行" width="100" height="100" class="m_service_item-icon" />
                                </div>
                            </div>
                            <!-- /.m_service_item-icon-wrapper -->
                            <p class="m_service_item_name">アクセス解析代行</p>
                        </li>
                        <!-- /.m_service_item -->
                        <li class="m_service_item js_service">
                            <div class="m_service_item__circle">
                                <div class="m_service_item-icon-wrapper">
                                    <img src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/icon_service06.svg'); ?>"
                                        alt="SNSマーケ支援" width="100" height="100" class="m_service_item-icon" />
                                </div>
                            </div>
                            <!-- /.m_service_item-icon-wrapper -->
                            <p class="m_service_item_name">SNSマーケ支援</p>
                        </li>
                        <!-- /.m_service_item -->
                    </ul>
                    <div class="m_btn-wrapper top_section_btn-wrapper ">
                        <a href="<?php echo esc_url(home_url('/service')); ?>" class="m_btn  m_btn__more">
                            詳しく見る
                        </a>
                    </div>
                    <!-- /.m_btn-wrapper -->
                </div>
                <!-- /.top_service_body -->
            </div>
        </div>
        <!-- /.l_contents -->
    </section>
    <section class="top_case">
        <div class="l_contents">
            <div class="l_container-lg">
                <h2 class="top_section_title top_section_title__case">事例</h2>
                <div class="top_case_content">
                    <div class="top_case_list-wrapper js_case-swiper">
                        <ul class="top_case_list swiper-wrapper">
                            <?php
                            $args = array(
                            'post_type' => 'case', //カスタム投稿タイプを指定
                            'posts_per_page' => 3, //表示する記事数
                            );

                            $the_query = new WP_Query($args);
                            if ($the_query->have_posts()):
                            while ($the_query->have_posts()): $the_query->the_post();
                            ?>
                            <li class="top_case_item swiper-slide">
                                <a href="<?php the_permalink(); ?>" class="top_case_item_link">
                                    <div class="top_case_item_thumb-wrapper">
                                        <?php the_post_thumbnail(null, array('class' => 'top_case_item_thumb')); ?>
                                    </div>
                                    <!-- /.top_case_item_thumb-wrapper -->
                                    <div class="top_case_item_txt">
                                        <h2 class="top_case_item_heading">
                                            <?php the_title(); ?>
                                        </h2>
                                    </div>
                                    <!-- /.top_case_item_txt -->
                                </a>
                            </li>
                            <?php endwhile; ?>
                            <?php wp_reset_postdata(); ?>
                            <?php endif; ?>
                        </ul>
                    </div>
                    <!-- /.top_case_list-wrapper -->
                    <div class="top_case_dots swiper-pagination"></div>
                    <button class="top_case_nav top_case_nav__prev swiper-button-prev"></button>
                    <button class="top_case_nav top_case_nav__next swiper-button-next"></button>
                </div>
                <!-- /.top_case_content -->
                <div class="m_btn-wrapper top_section_btn-wrapper ">
                    <a href="<?php echo esc_url(get_post_type_archive_link('case')); ?>" class="m_btn  m_btn__more">
                        詳しく見る
                    </a>
                </div>
                <!-- /.m_btn-wrapper -->
            </div>
            <!-- /.l_container-lg -->
        </div>
        <!-- /.l_contents -->
    </section>
</main>

<?php get_template_part('cta'); ?>

<?php get_footer(); ?>