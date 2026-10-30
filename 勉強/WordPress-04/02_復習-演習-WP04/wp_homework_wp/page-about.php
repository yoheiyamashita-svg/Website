<?php get_header(); ?>

<?php
if (have_posts()) :
  while (have_posts()) :
    the_post();
?>

    <?php get_template_part('m_kv'); ?>

    <main class="about_main l_page-main">
      <section class="about_greeting">
        <div class="l_container">
          <h2 class="m_page-section-heading">代表挨拶</h2>
          <div class="about_greeting_body">
            <div class="about_greeting_img-wrapper">
              <img
                src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/img_about-us.jpg'); ?>"
                alt=""
                width="768"
                height="576"
                class="about_greeting_img" />
            </div>
            <!-- /.about_greeting_img-wrapper -->
            <div class="about_greeting_txts">
              <h2 class="about_greeting_heading">
                スタートアップのデジタルマーケティングを全力で支援する会社です。
              </h2>
              <p class="about_greeting_desc">
                親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。親譲りの無鉄砲で小供の時から損ばかりしている。
              </p>
            </div>
            <!-- /.about_greeting_txts -->
          </div>
          <!-- /.about_greeting_body -->
        </div>
        <!-- /.l_container -->
      </section>
      <section class="about_info">
        <div class="l_container-sm">
          <h2 class="m_page-section-heading">会社概要</h2>
          <div class="about_info_body">
            <table class="about_info-table">
              <tr class="about_info-table_row">
                <th class="about_info-table_heading">商号</th>
                <td class="about_info-table_data">株式会社ZeroPlus</td>
              </tr>
              <tr class="about_info-table_row">
                <th class="about_info-table_heading">従業員数</th>
                <td class="about_info-table_data">11名</td>
              </tr>
              <tr class="about_info-table_row">
                <th class="about_info-table_heading">資本金</th>
                <td class="about_info-table_data">5,000,000円</td>
              </tr>
              <tr class="about_info-table_row">
                <th class="about_info-table_heading">設立</th>
                <td class="about_info-table_data">2018年8月</td>
              </tr>
              <tr class="about_info-table_row">
                <th class="about_info-table_heading">TEL</th>
                <td class="about_info-table_data">0000-0000-0000</td>
              </tr>
              <tr class="about_info-table_row">
                <th class="about_info-table_heading">FAX</th>
                <td class="about_info-table_data">0000-0000-0000</td>
              </tr>
              <tr class="about_info-table_row">
                <th class="about_info-table_heading">E-mail</th>
                <td class="about_info-table_data">@info.sample.com</td>
              </tr>
              <tr class="about_info-table_row">
                <th class="about_info-table_heading">所在地</th>
                <td class="about_info-table_data">
                  〒000-0000<br />東京都豊島区池袋0-00
                </td>
              </tr>
            </table>
          </div>
          <!-- /.about_info_body -->
        </div>
        <!-- /.l_container -->
      </section>
    </main>

    <?php get_template_part('cta'); ?>

<?php
  endwhile;
endif;
?>

<?php get_footer(); ?>