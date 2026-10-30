<?php get_header(); ?>

<?php
if (have_posts()):
  while (have_posts()):
    the_post();
?>

    <?php get_template_part('m_kv'); ?>

    <main class="l_main">
      <section class="company_section">
        <div class="l_contents">
          <div class="l_container-sm">
            <h2 class="company_section_title">代表メッセージ</h2>
            <div class="company_section_img-wrapper">
              <img
                src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/img_ceo.jpg'); ?>"
                width="1520"
                height="884"
                alt="代表の写真"
                class="company_section_img" />
            </div>
            <!-- /.company_section_img-wrapper -->
            <p class="company_section_txt">
              親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーい。と囃したからである。小使に負ぶさって帰って来た時、おやじが大きな眼をして二階ぐらいから飛び降りて腰を抜かす奴があるかと云ったから、この次は抜かさずに飛んで見せますと答えた。（青空文庫より）
            </p>
            <p class="company_section_txt">
              親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーい。と囃したからである。小使に負ぶさって帰って来た時、おやじが大きな眼をして二階ぐらいから飛び降りて腰を抜かす奴があるかと云ったから、この次は抜かさずに飛んで見せますと答えた。（青空文庫より）
            </p>
          </div>
          <!-- /.l_container-sm -->
        </div>
        <!-- /.l_contents -->
      </section>

      <section class="company_section">
        <div class="l_contents">
          <div class="l_container-sm">
            <h2 class="company_section_title">ミッション・ビジョン</h2>
            <div class="company_section_img-wrapper">
              <img
                src="<?php echo esc_url(get_template_directory_uri() . '/img/corporate/img_mission.png'); ?>"
                width="1520"
                height="884"
                alt="ミッション・ビジョンの図"
                class="company_section_img" />
            </div>
            <!-- /.company_section_img-wrapper -->
            <p class="company_section_txt">
              親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーい。と囃したからである。小使に負ぶさって帰って来た時、おやじが大きな眼をして二階ぐらいから飛び降りて腰を抜かす奴があるかと云ったから、この次は抜かさずに飛んで見せますと答えた。（青空文庫より）
            </p>
            <p class="company_section_txt">
              親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーい。と囃したからである。小使に負ぶさって帰って来た時、おやじが大きな眼をして二階ぐらいから飛び降りて腰を抜かす奴があるかと云ったから、この次は抜かさずに飛んで見せますと答えた。（青空文庫より）
            </p>
          </div>
          <!-- /.l_container-sm -->
        </div>
        <!-- /.l_contents -->
      </section>

      <section class="company_section">
        <div class="l_contents">
          <div class="l_container-sm">
            <h2 class="company_section_title">会社情報</h2>
            <table class="company_section_table">
              <tr class="company_section_tr">
                <th class="company_section_th">商号</th>
                <td class="company_section_td">株式会社01</td>
              </tr>
              <tr class="company_section_tr">
                <th class="company_section_th">代表</th>
                <td class="company_section_td">ZeroPlus太郎</td>
              </tr>
              <tr class="company_section_tr">
                <th class="company_section_th">従業員数</th>
                <td class="company_section_td">11名</td>
              </tr>
              <tr class="company_section_tr">
                <th class="company_section_th">資本金</th>
                <td class="company_section_td">5,000,000円</td>
              </tr>
              <tr class="company_section_tr">
                <th class="company_section_th">設立</th>
                <td class="company_section_td">2018年8月</td>
              </tr>
              <tr class="company_section_tr">
                <th class="company_section_th">TEL</th>
                <td class="company_section_td">0000-0000-0000</td>
              </tr>
              <tr class="company_section_tr">
                <th class="company_section_th">FAX</th>
                <td class="company_section_td">0000-0000-0000</td>
              </tr>
              <tr class="company_section_tr">
                <th class="company_section_th">E-mail</th>
                <td class="company_section_td">@info.sample.com</td>
              </tr>
              <tr class="company_section_tr">
                <th class="company_section_th">所在地</th>
                <td class="company_section_td">
                  〒000-0000<br />東京都豊島区池袋0-00-0
                </td>
              </tr>
            </table>
          </div>
          <!-- /.l_container-sm -->
        </div>
        <!-- /.l_contents -->
      </section>

      <?php get_template_part('cta'); ?>

    </main>

<?php
  endwhile;
endif;
?>

<?php get_footer(); ?>