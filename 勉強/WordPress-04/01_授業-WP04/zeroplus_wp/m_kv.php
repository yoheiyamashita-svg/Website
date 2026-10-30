<div class="m_kv">
  <div class="m_kv-inner l_container-lg">
    <div class="m_kv-box">
      <?php if ((is_post_type_archive('case') || is_singular('case'))): ?>
        <h1 class="m_kv-title">事例</h1>
      <?php elseif ((is_404())): ?>
        <h1 class="m_kv-title">404</h1>
      <?php else: ?>
        <h1 class="m_kv-title">
          <?php the_title(); ?>
        </h1>
      <?php endif; ?>

      <?php if (is_page("service")): ?>
        <p class="m_kv-desc">弊社が提供するマーケティングサービスを紹介します。</p>
      <?php elseif ((is_post_type_archive('case') || is_singular('case'))): ?>
        <p class="m_kv-desc">弊社のマーケティングサポートの事例を紹介します。</p>
      <?php elseif ((is_page("company"))): ?>
        <p class="m_kv-desc">弊社の代表からの挨拶、企業理念について紹介します。</p>
      <?php elseif ((is_page("contact"))): ?>
        <p class="m_kv-desc">以下のフォームからご記入ください。</p>
      <?php elseif ((is_page("privacy"))): ?>
        <p class="m_kv-desc">以下の方針でお客様の個人情報を取り扱います。</p>
      <?php elseif ((is_404())): ?>
        <p class="m_kv-desc">お探しのページは見つかりません。</p>
      <?php endif; ?>
    </div>
    <!-- /.m_kv-box -->
  </div>
  <!-- /.m_kv-inner -->
</div>
<!-- /.m_kv -->