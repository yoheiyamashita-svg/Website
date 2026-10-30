<?php get_header(); ?>

<?php
if (have_posts()) :
  while (have_posts()) :
    the_post();
?>

    <?php get_template_part('m_kv'); ?>

    <main class="contact_main l_page-main">
      <div class="l_container-sm">
        <form action="" class="contact_form">
          <dl class="contact_form_list">
            <dt class="contact_form_heading">
              会社名<span class="contact_form_required">必須</span>
            </dt>
            <dd class="contact_form_detail">
              <input type="text" class="contact_form_input" />
              <div class="contact_form_example-wrapper">
                <span class="contact_form_example">例.株式会社SAMPLE</span>
              </div>
              <!-- /.contact_form_example-wrapper -->
            </dd>
            <dt class="contact_form_heading">
              お名前<span class="contact_form_required">必須</span>
            </dt>
            <dd class="contact_form_detail">
              <input type="text" class="contact_form_input" />
              <div class="contact_form_example-wrapper">
                <span class="contact_form_example">例.山田太郎</span>
              </div>
              <!-- /.contact_form_example-wrapper -->
            </dd>
            <dt class="contact_form_heading">
              フリガナ<span class="contact_form_required">必須</span>
            </dt>
            <dd class="contact_form_detail">
              <input type="text" class="contact_form_input" />
              <div class="contact_form_example-wrapper">
                <span class="contact_form_example">例.ヤマダタロウ</span>
              </div>
              <!-- /.contact_form_example-wrapper -->
            </dd>
            <dt class="contact_form_heading">
              電話番号<span class="contact_form_required">必須</span>
            </dt>
            <dd class="contact_form_detail">
              <input type="text" class="contact_form_input" />
              <div class="contact_form_example-wrapper">
                <span class="contact_form_example">例.09012345678</span>
              </div>
              <!-- /.contact_form_example-wrapper -->
            </dd>
            <dt class="contact_form_heading">
              メールアドレス<span class="contact_form_required">必須</span>
            </dt>
            <dd class="contact_form_detail">
              <input type="text" class="contact_form_input" />
              <div class="contact_form_example-wrapper">
                <span class="contact_form_example">例.sample@info</span>
              </div>
              <!-- /.contact_form_example-wrapper -->
            </dd>
            <dt class="contact_form_heading">
              ご依頼内容<span class="contact_form_required">必須</span>
            </dt>
            <dd class="contact_form_detail__other">
              <ul class="contact_form_check-list">
                <li class="contact_form_check-item">
                  <label
                    class="contact_form_request-item-inner"
                    for="request-01">
                    <input
                      type="checkbox"
                      name="request"
                      id="request-01"
                      class="contact_form_checkbox" />
                    <span class="contact_form_request-txt">依頼内容が入ります</span>
                  </label>
                </li>
                <li class="contact_form_check-item">
                  <label
                    class="contact_form_request-item-inner"
                    for="request-02">
                    <input
                      type="checkbox"
                      name="request"
                      id="request-02"
                      class="contact_form_checkbox" />
                    <span class="contact_form_request-txt">依頼内容が入ります</span>
                  </label>
                </li>
                <li class="contact_form_check-item">
                  <label
                    class="contact_form_request-item-inner"
                    for="request-03">
                    <input
                      type="checkbox"
                      name="request"
                      id="request-03"
                      class="contact_form_checkbox" />
                    <span class="contact_form_request-txt">依頼内容が入ります</span>
                  </label>
                </li>
                <li class="contact_form_check-item">
                  <label
                    class="contact_form_request-item-inner"
                    for="request-04">
                    <input
                      type="checkbox"
                      name="request"
                      id="request-04"
                      class="contact_form_checkbox" />
                    <span class="contact_form_request-txt">依頼内容が入ります</span>
                  </label>
                </li>
                <li class="contact_form_check-item">
                  <label
                    class="contact_form_request-item-inner"
                    for="request-05">
                    <input
                      type="checkbox"
                      name="request"
                      id="request-05"
                      class="contact_form_checkbox" />
                    <span class="contact_form_request-txt">依頼内容が入ります</span>
                  </label>
                </li>
              </ul>
            </dd>
            <dt class="contact_form_heading">
              お問い合わせ内容<span class="contact_form_required">必須</span>
            </dt>
            <dd class="contact_form_detail__other">
              <textarea class="contact_form_textarea"></textarea>
            </dd>
          </dl>
          <div class="m_btn-wrapper contact_form_btn-wrapper">
            <input class="m_btn m_btn__more" type="submit" value="送信する" />
          </div>
          <!-- /.m_btn-wrapper -->
        </form>
      </div>
      <!-- /.l_container-sm -->
    </main>

<?php
  endwhile;
endif;
?>

<?php get_footer(); ?>