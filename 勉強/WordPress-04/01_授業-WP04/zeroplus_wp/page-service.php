<?php get_header(); ?>

<?php
if (have_posts()) :
  while (have_posts()) :
    the_post();
?>

    <?php get_template_part('m_kv'); ?>

    <main class="l_main">
      <div class="service_menu">
        <div class="l_contents">
          <div class="l_container">
            <p class="service_menu_message">
              クライアント様の課題に応じて<br />
              <span class="service_menu_message__emphasis">戦略立案</span>から、<span class="service_menu_message__emphasis">実行支援</span>まで、 <br class="u_lg-dn" />共に併走します。
            </p>
            <p class="service_menu_desc">
              ボタンをクリックすると該当箇所まで移動します。
            </p>
            <p class="service_menu_txt u_lg-dn">
              横にスクロールすると、ボタンが表示されます。
            </p>
            <div class="service_menu_wrapper">
              <ul class="service_menu_list">
                <li class="service_menu_item">
                  <a
                    href="#service_desc_marketing"
                    class="m_btn m_btn__right-arrow">
                    マーケティング支援
                  </a>
                </li>
                <li class="service_menu_item">
                  <a href="#service_desc_web" class="m_btn m_btn__right-arrow">
                    webサイト制作
                  </a>
                </li>
                <li class="service_menu_item">
                  <a href="#service_desc_seo" class="m_btn m_btn__right-arrow">
                    SEO対策支援
                  </a>
                </li>
                <li class="service_menu_item">
                  <a
                    href="#service_desc_access"
                    class="m_btn m_btn__right-arrow">
                    アクセス解析代行
                  </a>
                </li>
                <li class="service_menu_item">
                  <a href="#service_desc_ad" class="m_btn m_btn__right-arrow">
                    広告効果測定
                  </a>
                </li>
                <li class="service_menu_item">
                  <a href="#service_desc_sns" class="m_btn m_btn__right-arrow">
                    SNSマーケ支援
                  </a>
                </li>
                <li class="service_menu_item">
                  <a
                    href="#service_desc_content"
                    class="m_btn m_btn__right-arrow">
                    コンテンツ制作代行
                  </a>
                </li>
                <li class="service_menu_item">
                  <a href="#service_desc_grow" class="m_btn m_btn__right-arrow">
                    成長戦略立案
                  </a>
                </li>
              </ul>
            </div>
            <!-- /.service_menu_wrapper -->
            <div class="service_menu-scroll u_lg-dn">
              <p class="service_menu-scroll_txt">scroll</p>
              <p class="service_menu-scroll_arrow">→</p>
            </div>
            <!-- /.service_menu-scroll -->
          </div>
          <!-- /.l_container-lg -->
        </div>
        <!-- /.l_contents -->
      </div>
      <!-- /.service_menu -->
      <div class="service_desc">
        <div class="l_container-sm">
          <article class="service_desc_article" id="service_desc_marketing">
            <div class="service_desc_img-wrapper">
              <img
                src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/img_service.svg'); ?>"
                width="168"
                height="168"
                alt="マーケティング支援"
                class="service_desc_img" />
            </div>
            <!-- /.service_desc_img-wrapper -->
            <div class="service_desc_content">
              <h2 class="service_desc_title">マーケティング支援</h2>
              <p class="service_desc_txt">
                親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。
              </p>
            </div>
            <!-- /.service_desc_content -->
          </article>
          <article class="service_desc_article" id="service_desc_web">
            <div class="service_desc_img-wrapper">
              <img
                src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/img_service02.svg'); ?>"
                width="168"
                height="168"
                alt="webサイト制作"
                class="service_desc_img" />
            </div>
            <!-- /.service_desc_img-wrapper -->
            <div class="service_desc_content">
              <h2 class="service_desc_title">webサイト制作</h2>
              <p class="service_desc_txt">
                親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。
              </p>
            </div>
            <!-- /.service_desc_content -->
          </article>
          <article class="service_desc_article" id="service_desc_seo">
            <div class="service_desc_img-wrapper">
              <img
                src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/img_service03.svg'); ?>"
                width="168"
                height="168"
                alt="SEO対策支援"
                class="service_desc_img" />
            </div>
            <!-- /.service_desc_img-wrapper -->
            <div class="service_desc_content">
              <h2 class="service_desc_title">SEO対策支援</h2>
              <p class="service_desc_txt">
                親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。
              </p>
            </div>
            <!-- /.service_desc_content -->
          </article>
          <article class="service_desc_article" id="service_desc_access">
            <div class="service_desc_img-wrapper">
              <img
                src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/img_service04.svg'); ?>"
                width="168"
                height="168"
                alt="アクセス解析代行"
                class="service_desc_img" />
            </div>
            <!-- /.service_desc_img-wrapper -->
            <div class="service_desc_content">
              <h2 class="service_desc_title">アクセス解析代行</h2>
              <p class="service_desc_txt">
                親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。
              </p>
            </div>
            <!-- /.service_desc_content -->
          </article>
          <article class="service_desc_article" id="service_desc_ad">
            <div class="service_desc_img-wrapper">
              <img
                src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/img_service05.svg'); ?>"
                width="168"
                height="168"
                alt="広告効果測定"
                class="service_desc_img" />
            </div>
            <!-- /.service_desc_img-wrapper -->
            <div class="service_desc_content">
              <h2 class="service_desc_title">広告効果測定</h2>
              <p class="service_desc_txt">
                親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。
              </p>
            </div>
            <!-- /.service_desc_content -->
          </article>
          <article class="service_desc_article" id="service_desc_sns">
            <div class="service_desc_img-wrapper">
              <img
                src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/img_service06.svg'); ?>"
                width="168"
                height="168"
                alt="SNSマーケ支援"
                class="service_desc_img" />
            </div>
            <!-- /.service_desc_img-wrapper -->
            <div class="service_desc_content">
              <h2 class="service_desc_title">SNSマーケ支援</h2>
              <p class="service_desc_txt">
                親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。
              </p>
            </div>
            <!-- /.service_desc_content -->
          </article>
          <article class="service_desc_article" id="service_desc_content">
            <div class="service_desc_img-wrapper">
              <img
                src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/img_service07.svg'); ?>"
                width="168"
                height="168"
                alt="コンテンツ制作代行"
                class="service_desc_img" />
            </div>
            <!-- /.service_desc_img-wrapper -->
            <div class="service_desc_content">
              <h2 class="service_desc_title">コンテンツ制作代行</h2>
              <p class="service_desc_txt">
                親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。
              </p>
            </div>
            <!-- /.service_desc_content -->
          </article>
          <article class="service_desc_article" id="service_desc_grow">
            <div class="service_desc_img-wrapper">
              <img
                src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/img_service08.svg'); ?>"
                width="168"
                height="168"
                alt="成長戦略立案"
                class="service_desc_img" />
            </div>
            <!-- /.service_desc_img-wrapper -->
            <div class="service_desc_content">
              <h2 class="service_desc_title">成長戦略立案</h2>
              <p class="service_desc_txt">
                親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。
              </p>
            </div>
            <!-- /.service_desc_content -->
          </article>
        </div>
        <!-- /.l_container-lg -->
      </div>
      <!-- /.service_desc -->

      <?php get_template_part('cta'); ?>

      <section class="service_faq">
        <div class="l_contents">
          <div class="l_container-lg">
            <div class="m_section_title">
              <p class="m_section_title__sub">Q&A</p>
              <h2 class="m_section_title__main">よくある質問</h2>
            </div>
            <!-- /.m_section-title -->
            <div class="service_faq_wrapper">
              <?php if (get_field('question_1')): ?>
                <button class="service_faq_button js_faq">
                  <div class="service_faq_box">
                    <div class="service_faq_content">
                      <span class="service_faq_icon service_faq_icon__q">Q.</span>
                      <p class="service_faq_txt">
                        <?php echo get_field('question_1'); ?>
                      </p>
                    </div>
                    <!-- /.service_faq_content -->
                    <div class="service_faq_open js_faq-a">
                      <div class="service_faq_content service_faq_content__a">
                        <span class="service_faq_icon service_faq_icon__a">A.</span>
                        <p class="service_faq_txt">
                          <?php echo get_field('answer_1'); ?>
                        </p>
                      </div>
                      <!-- /.service_faq_content -->
                    </div>
                    <!-- /.service_faq_open -->
                  </div>
                  <!-- /.service_faq_box -->
                  <div class="service_faq_mark js_faq_mark"></div>
                  <!-- /.service_faq_mark js_faq_mark -->
                </button>
              <?php endif; ?>
              <?php if (get_field('question_2')): ?>
                <button class="service_faq_button js_faq">
                  <div class="service_faq_box">
                    <div class="service_faq_content">
                      <span class="service_faq_icon service_faq_icon__q">Q.</span>
                      <p class="service_faq_txt">
                        <?php echo get_field('question_2'); ?>
                      </p>
                    </div>
                    <!-- /.service_faq_content -->
                    <div class="service_faq_open js_faq-a">
                      <div class="service_faq_content service_faq_content__a">
                        <span class="service_faq_icon service_faq_icon__a">A.</span>
                        <p class="service_faq_txt">
                          <?php echo get_field('answer_2'); ?>
                        </p>
                      </div>
                      <!-- /.service_faq_content -->
                    </div>
                    <!-- /.service_faq_open -->
                  </div>
                  <!-- /.service_faq_box -->
                  <div class="service_faq_mark js_faq_mark"></div>
                  <!-- /.service_faq_mark js_faq_mark -->
                </button>
              <?php endif; ?>
              <?php if (get_field('question_3')): ?>
                <button class="service_faq_button js_faq">
                  <div class="service_faq_box">
                    <div class="service_faq_content">
                      <span class="service_faq_icon service_faq_icon__q">Q.</span>
                      <p class="service_faq_txt">
                        <?php echo get_field('question_3'); ?>
                      </p>
                    </div>
                    <!-- /.service_faq_content -->
                    <div class="service_faq_open js_faq-a">
                      <div class="service_faq_content service_faq_content__a">
                        <span class="service_faq_icon service_faq_icon__a">A.</span>
                        <p class="service_faq_txt">
                          <?php echo get_field('answer_3'); ?>
                        </p>
                      </div>
                      <!-- /.service_faq_content -->
                    </div>
                    <!-- /.service_faq_open -->
                  </div>
                  <!-- /.service_faq_box -->
                  <div class="service_faq_mark js_faq_mark"></div>
                  <!-- /.service_faq_mark js_faq_mark -->
                </button>
              <?php endif; ?>
              <?php if (get_field('question_4')): ?>
                <button class="service_faq_button js_faq">
                  <div class="service_faq_box">
                    <div class="service_faq_content">
                      <span class="service_faq_icon service_faq_icon__q">Q.</span>
                      <p class="service_faq_txt">
                        <?php echo get_field('question_4'); ?>
                      </p>
                    </div>
                    <!-- /.service_faq_content -->
                    <div class="service_faq_open js_faq-a">
                      <div class="service_faq_content service_faq_content__a">
                        <span class="service_faq_icon service_faq_icon__a">A.</span>
                        <p class="service_faq_txt">
                          <?php echo get_field('answer_4'); ?>
                        </p>
                      </div>
                      <!-- /.service_faq_content -->
                    </div>
                    <!-- /.service_faq_open -->
                  </div>
                  <!-- /.service_faq_box -->
                  <div class="service_faq_mark js_faq_mark"></div>
                  <!-- /.service_faq_mark js_faq_mark -->
                </button>
              <?php endif; ?>

            </div>
            <!-- /.service_faq_wrapper -->
          </div>
          <!-- /.l_container-lg -->
        </div>
        <!-- /.l_contents -->
      </section>
      <!-- /.service_faq -->

      <?php get_template_part('cta'); ?>

    </main>

<?php
  endwhile;
endif;
?>

<?php get_footer(); ?>