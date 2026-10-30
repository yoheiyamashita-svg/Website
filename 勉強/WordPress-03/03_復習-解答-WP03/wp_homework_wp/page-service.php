<?php get_header(); ?>

<?php
if (have_posts()) :
  while (have_posts()) :
    the_post();
?>

    <?php get_template_part('m_kv'); ?>

    <main class="service_main l_page-main">
      <section class="service_contents">
        <div class="l_container">
          <h2 class="m_page-section-heading">
            弊社が提供するデジタル<br
              class="u_lg-dn" />マーケティング支援サービス
          </h2>
          <p class="service_contents_desc">
            親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。親譲りの無鉄砲で小供の時から損ばかりしている。
          </p>
          <div class="m_service_contents">
            <div class="m_service_item">
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
            <div class="m_service_item">
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
            <div class="m_service_item">
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
            <div class="m_service_item">
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
            <div class="m_service_item">
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
            <div class="m_service_item">
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
        </div>
        <!-- /.l_container -->
      </section>
      <section class="service_faq">
        <div class="l_container-sm">
          <h2 class="m_page-section-heading">よくあるご質問</h2>
          <div class="service_faq_body">
            <?php if (get_field('question_1')): ?>
              <div class="service_faq_unit js_faq">
                <button class="service_faq-question">
                  <span class="service_faq-question_tag"> Q </span>
                  <p class="service_faq-question_txt">
                    <?php echo get_field('question_1'); ?>
                  </p>
                  <span class="service_faq-question_mark js_faq_mark"></span>
                  <!-- /.service_faq-question_mark -->
                </button>
                <div class="service_faq-answer js_faq-a">
                  <div class="service_faq-answer_inner">
                    <span class="service_faq-answer_tag"> A </span>
                    <p class="service_faq-answer_txt">
                      <?php echo get_field('answer_1'); ?>
                    </p>
                  </div>
                </div>
                <!-- /.service_faq-answer -->
              </div>
              <!-- /.service_faq_unit -->
            <?php endif; ?>
            <?php if (get_field('question_2')): ?>
              <div class="service_faq_unit js_faq">
                <button class="service_faq-question">
                  <span class="service_faq-question_tag"> Q </span>
                  <p class="service_faq-question_txt">
                    <?php echo get_field('question_2'); ?>
                  </p>
                  <span class="service_faq-question_mark js_faq_mark"></span>
                  <!-- /.service_faq-question_mark -->
                </button>
                <div class="service_faq-answer js_faq-a">
                  <div class="service_faq-answer_inner">
                    <span class="service_faq-answer_tag"> A </span>
                    <p class="service_faq-answer_txt">
                      <?php echo get_field('answer_2'); ?>
                    </p>
                  </div>
                </div>
                <!-- /.service_faq-answer -->
              </div>
              <!-- /.service_faq_unit -->
            <?php endif; ?>
            <?php if (get_field('question_3')): ?>
              <div class="service_faq_unit js_faq">
                <button class="service_faq-question">
                  <span class="service_faq-question_tag"> Q </span>
                  <p class="service_faq-question_txt">
                    <?php echo get_field('question_3'); ?>
                  </p>
                  <span class="service_faq-question_mark js_faq_mark"></span>
                  <!-- /.service_faq-question_mark -->
                </button>
                <div class="service_faq-answer js_faq-a">
                  <div class="service_faq-answer_inner">
                    <span class="service_faq-answer_tag"> A </span>
                    <p class="service_faq-answer_txt">
                      <?php echo get_field('answer_3'); ?>
                    </p>
                  </div>
                </div>
                <!-- /.service_faq-answer -->
              </div>
              <!-- /.service_faq_unit -->
            <?php endif; ?>
          </div>
          <!-- /.service_faq_body -->
        </div>
        <!-- /.l_contaier-sm -->
      </section>
    </main>

    <?php get_template_part('cta'); ?>

<?php
  endwhile;
endif;
?>


<?php get_footer(); ?>