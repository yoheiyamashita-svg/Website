<?php get_header(); ?>

<?php
if (have_posts()):
  while (have_posts()):
    the_post();
?>

    <?php get_template_part('m_kv'); ?>

    <main class="l_main">
      <div class="l_contents">
        <div class="l_container-sm">
          <form action="" class="contact_form">
            <dl class="contact_form_list">
              <dt class="contact_form_heading">
                会社名<span class="contact_form_example">例.株式会社Sample</span>
              </dt>
              <dd class="contact_form_detail">
                <input type="text" class="contact_form_input" />
              </dd>
              <dt class="contact_form_heading">
                お名前<span class="contact_form_example">例.山田太郎</span>
                <span class="contact_form_required">必須</span>
              </dt>
              <dd class="contact_form_detail">
                <input type="text" class="contact_form_input" />
              </dd>
              <dt class="contact_form_heading">
                お名前 (フリガナ)<span class="contact_form_example">例.ヤマダタロウ</span>
                <span class="contact_form_required">必須</span>
              </dt>
              <dd class="contact_form_detail">
                <input type="text" class="contact_form_input" />
              </dd>
              <dt class="contact_form_heading">
                電話番号<span class="contact_form_example">例.0312345678</span>
                <span class="contact_form_required">必須</span>
              </dt>
              <dd class="contact_form_detail">
                <input type="tel" class="contact_form_input" />
              </dd>
              <dt class="contact_form_heading">
                メールアドレス<span class="contact_form_example">例.info@sample.com</span>
                <span class="contact_form_required">必須</span>
              </dt>
              <dd class="contact_form_detail">
                <input type="email" class="contact_form_input" />
              </dd>
              <dt class="contact_form_heading">
                お問い合わせ項目
                <span class="contact_form_required">必須</span>
              </dt>
              <dd class="contact_form_detail">
                <ul class="contact_form_radio-list">
                  <li class="contact_form_radio-item">
                    <input
                      type="radio"
                      name="content"
                      value=""
                      id="1"
                      class="contact_form_radio"
                      checked /><label for="1" class="contact_form_label">項目A</label>
                  </li>
                  <li class="contact_form_radio-item">
                    <input
                      type="radio"
                      name="content"
                      value=""
                      id="2"
                      class="contact_form_radio" /><label for="2" class="contact_form_label">項目B</label>
                  </li>
                  <li class="contact_form_radio-item">
                    <input
                      type="radio"
                      name="content"
                      value=""
                      id="3"
                      class="contact_form_radio" /><label for="3" class="contact_form_label">項目C</label>
                  </li>
                  <li class="contact_form_radio-item">
                    <input
                      type="radio"
                      name="content"
                      value=""
                      id="4"
                      class="contact_form_radio" /><label for="4" class="contact_form_label">項目D</label>
                  </li>
                </ul>
              </dd>
              <dt class="contact_form_heading">
                お問い合わせ内容
                <span class="contact_form_required">必須</span>
              </dt>
              <dd class="contact_form_detail">
                <textarea
                  class="contact_form_textarea"
                  placeholder="ご自由にご記入ください。"></textarea>
              </dd>
            </dl>
            <div class="contact_form_privacy-wrapper">
              <input type="checkbox" name="" class="contact_form_privacy" /><a
                href="プライバシーポリシーページのURL"
                class="contact_form_privacy-link"
                target="_blank"
                rel="noopener noreferrer">プライバシーポリシー</a>に同意する
            </div>

            <div class="contact_form_btn-wrapper">
              <div class="m_btn m_btn__right-arrow m_btn__contact">
                <input
                  type="submit"
                  class="m_btn_input"
                  value="この内容で送信する" />
              </div>
              <!-- /.m_btn -->
            </div>
            <!-- /.contact_form_btn-wrapper -->
          </form>
        </div>
        <!-- /.l_container-sm -->
      </div>
      <!-- /.l_contents -->
    </main>

<?php
  endwhile;
endif;
?>

<?php get_footer(); ?>