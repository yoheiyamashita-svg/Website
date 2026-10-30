<?php get_header(); ?>

<div class="top_kv">
  <div class="top_kv_contents l_container">
    <p class="top_kv_sub-copy js_sub-copy">
      START UP FOR DIGITAL MARKETING.
    </p>
    <p class="top_kv_copy js_copy">
      スタートアップの<br />
      デジタルマーケティングを<br />
      徹底的にサポートする。
    </p>
    <div class="m_btn-wrapper top_kv_btn-wrapper">
      <a href="<?php echo esc_url(home_url('/contact')); ?>" class="m_btn m_btn__cta"> 無料で相談する </a>
    </div>
    <!-- /.m_btn-wrapper -->
  </div>
  <!-- /.top_kv_contents -->
  <div class="top_kv-scroll-down">
    <span class="top_kv-scroll-down_txt">SCROLL</span>
    <div class="top_kv-scroll-down_arrow"></div>
    <!-- /.top_kv-scroll-down_arrow -->
  </div>
  <!-- /.top_kv-scroll-down -->
</div>
<!-- /.kv -->

<!-- 
      KVのスライドショー
      WordPress3回目でJSの導入を行います。
      JSの読み込みを行った後に下記コメントアウトを外してください。
      corporate.css .top_kvの記述も修正が必要になります。
    -->
<div class="top_kv-slideshow js_slideshow">
  <div class="swiper-wrapper">
    <div class="top_kv-slideshow_slide swiper-slide">
      <img class="top_kv-slideshow_slide_img" src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/bg_kv.jpg'); ?>" alt="" />
    </div>
    <div class="top_kv-slideshow_slide swiper-slide">
      <img
        class="top_kv-slideshow_slide_img"
        src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/bg_kv02.jpg'); ?>"
        alt="" />
    </div>
    <div class="top_kv-slideshow_slide swiper-slide">
      <img
        class="top_kv-slideshow_slide_img"
        src="i<?php echo esc_url(get_template_directory_uri() . '/img/corporate/bg_kv03.jpg'); ?>"
        alt="" />
    </div>
    <div class="top_kv-slideshow_slide swiper-slide">
      <img
        class="top_kv-slideshow_slide_img"
        src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/bg_kv04.jpg'); ?>"
        alt="" />
    </div>
    <div class="top_kv-slideshow_slide swiper-slide">
      <img
        class="top_kv-slideshow_slide_img"
        src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/bg_kv05.jpg'); ?>"
        alt="" />
    </div>
  </div>
</div>
<!-- /.top_kv-slideshow -->
<main class="top_main">
  <section class="top_about">
    <div class="l_contents">
      <h2 class="m_section_title m_section_title__about">私たちについて</h2>
      <div class="top_about_body">
        <div class="top_about_contents l_container">
          <div class="top_about_img-wrapper">
            <img
              src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/img_about-us.jpg'); ?>"
              alt=""
              width="768"
              height="576"
              class="top_about_img" />
          </div>
          <!-- /.top_about_img-wrapper -->
          <div class="top_about_txts">
            <h2 class="top_about_heading">
              スタートアップの<br />
              デジタルマーケティングを<br />
              全力で支援する会社です。
            </h2>
            <p class="top_about_desc">
              親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。親譲りの無鉄砲で小供の時から損ばかりしている。
            </p>
          </div>
          <!-- /.top_about_txts -->
        </div>
        <!-- /.top_about_contents -->

        <div class="m_btn-wrapper top_about_btn-wrapper">
          <a href="<?php echo esc_url(home_url('/about')); ?>" class="m_btn m_btn__more"> 詳しく見る </a>
        </div>
        <!-- /.m_btn-wrapper -->
      </div>
      <!-- /.top_about_body -->
    </div>
    <!-- /.l_contents -->
  </section>
  <section class="top_service">
    <div class="l_contents js_service-trigger">
      <h2 class="m_section_title m_section_title__service">サービス</h2>
      <div class="top_service_body l_container">
        <p class="top_service_desc">
          親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。
        </p>
        <div class="m_service_contents">
          <div class="m_service_item js_service">
            <div class="m_service_item__circle">
              <div class="m_service_item-icon-wrapper">
                <img
                  src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/icon_service.svg'); ?>"
                  alt="マーケティング支援"
                  width="100"
                  height="100"
                  class="m_service_item-icon" />
              </div>
            </div>
            <!-- /.m_service_item-icon-wrapper -->
            <p class="m_service_item_name">マーケティング支援</p>
          </div>
          <!-- /.m_service_item -->
          <div class="m_service_item js_service">
            <div class="m_service_item__circle">
              <div class="m_service_item-icon-wrapper">
                <img
                  src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/icon_service02.svg'); ?>"
                  alt="webサイト制作"
                  width="100"
                  height="100"
                  class="m_service_item-icon" />
              </div>
            </div>
            <!-- /.m_service_item-icon-wrapper -->
            <p class="m_service_item_name">webサイト制作</p>
          </div>
          <!-- /.m_service_item -->
          <div class="m_service_item js_service">
            <div class="m_service_item__circle">
              <div class="m_service_item-icon-wrapper">
                <img
                  src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/icon_service03.svg'); ?>"
                  alt="SEO対策支援"
                  width="100"
                  height="100"
                  class="m_service_item-icon" />
              </div>
            </div>
            <!-- /.m_service_item-icon-wrapper -->
            <p class="m_service_item_name">SEO対策支援</p>
          </div>
          <!-- /.m_service_item -->
          <div class="m_service_item js_service">
            <div class="m_service_item__circle">
              <div class="m_service_item-icon-wrapper">
                <img
                  src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/icon_service04.svg'); ?>"
                  alt="広告効果測定"
                  width="100"
                  height="100"
                  class="m_service_item-icon" />
              </div>
            </div>
            <!-- /.m_service_item-icon-wrapper -->
            <p class="m_service_item_name">広告効果測定</p>
          </div>
          <!-- /.m_service_item -->
          <div class="m_service_item js_service">
            <div class="m_service_item__circle">
              <div class="m_service_item-icon-wrapper">
                <img
                  src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/icon_service05.svg'); ?>"
                  alt="アクセス解析代行"
                  width="100"
                  height="100"
                  class="m_service_item-icon" />
              </div>
            </div>
            <!-- /.m_service_item-icon-wrapper -->
            <p class="m_service_item_name">アクセス解析代行</p>
          </div>
          <!-- /.m_service_item -->
          <div class="m_service_item js_service">
            <div class="m_service_item__circle">
              <div class="m_service_item-icon-wrapper">
                <img
                  src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/icon_service06.svg'); ?>"
                  alt="SNSマーケ支援"
                  width="100"
                  height="100"
                  class="m_service_item-icon" />
              </div>
            </div>
            <!-- /.m_service_item-icon-wrapper -->
            <p class="m_service_item_name">SNSマーケ支援</p>
          </div>
          <!-- /.m_service_item -->
        </div>
        <!-- /.m_service_contents -->

        <div class="m_btn-wrapper top_service_btn-wrapper">
          <a href="<?php echo esc_url(home_url('/service')); ?>" class="m_btn m_btn__more"> 詳しく見る </a>
        </div>
        <!-- /.m_btn-wrapper -->
      </div>
      <!-- /.top_service_body -->
    </div>
    <!-- /.l_contents -->
  </section>
  <section class="top_case l_container-lg">
    <div class="l_contents">
      <h2 class="m_section_title m_section_title__case">実績</h2>
      <div class="top_case_body">
        <div class="top_case_list-wrapper js_case-swiper">
          <ul class="top_case_list swiper-wrapper">
            <?php
            $args = array(
              'post_type' => 'news',
              'posts_per_page' => '5'
            );
            $the_query = new WP_query($args);
            if ($the_query->have_posts()):
            ?>

              <div class="newsラップクラス名">

                <?php while ($the_query->have_posts()): $the_query->the_post(); ?>

                  <div class="news個別クラス名">

                    <a href="<?php the_permalink(); ?>">
                      <?php the_post_thumbnail('full'); ?></a>
                    <a href="<?php the_permalink(); ?>">
                      <h2><?php the_title(); ?></h2>
                    </a>
                  </div>

                <?php endwhile; ?>

              </div>

            <?php wp_reset_postdata();
            endif; ?>
            <?php
            $args = array(
              'post_type' => 'case',
              'posts_per_page' => '3'
            );
            $the_query = new WP_query($args);
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

            <?php endwhile;
              wp_reset_postdata();
            endif; ?>
          </ul>
          <div class="top_case_dots swiper-pagination"></div>

          <button
            class="top_case_nav top_case_nav__prev swiper-button-prev"></button>
          <button
            class="top_case_nav top_case_nav__next swiper-button-next"></button>
        </div>
        <!-- /.top_case_list-wrapper -->
        <div class="m_btn-wrapper top_case_btn-wrapper">
          <a href="<?php echo esc_url(get_post_type_archive_link('case')); ?>" class="m_btn m_btn__more"> 詳しく見る </a>
        </div>
        <!-- /.m_btn-wrapper -->
      </div>
      <!-- /.top_case_body -->
    </div>
    <!-- /.l_contents -->
  </section>
  <?php get_template_part('cta'); ?>
</main>

<?php get_footer(); ?>