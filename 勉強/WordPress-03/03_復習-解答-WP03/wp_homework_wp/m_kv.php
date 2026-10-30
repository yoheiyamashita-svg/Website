<?php
$page = get_post(get_the_ID());
$slug = $page->post_name;
?>

<div class="m_kv">
  <div class="m_kv_contents l_container-lg">
    <?php if ((is_post_type_archive('case') || is_singular('case'))): ?>
      <h1 class="m_kv_title m_kv_title__case">事例</h1>
    <?php elseif ((is_404())): ?>
      <h1 class="m_kv_title m_kv_title__404">404</h1>
    <?php else: ?>
      <h1 class="m_kv_title m_kv_title__<?php echo $slug; ?>">
        <?php the_title(); ?>
      </h1>
    <?php endif; ?>

    <?php if (is_page("about")): ?>
      <p class="m_kv_desc">弊社の代表からの挨拶、会社概要について紹介します。</p>
    <?php elseif ((is_post_type_archive('case') || is_singular('case'))): ?>
      <p class="m_kv_desc">弊社のマーケティングサポートの事例を紹介します。</p>
    <?php elseif ((is_page("service"))): ?>
      <p class="m_kv_desc">弊社のマーケティングサポートの事例を紹介します。</p>
    <?php elseif ((is_page("contact"))): ?>
      <p class="m_kv_desc">お申し込みフォームにて、お問い合わせ内容をご記入ください。</p>
    <?php elseif ((is_page("privacy"))): ?>
      <p class="m_kv_desc">以下の方針でお客様の個人情報を取り扱います。</p>
    <?php elseif ((is_404())): ?>
      <p class="m_kv_desc">お探しのページは見つかりません。</p>
    <?php endif; ?>
  </div>
  <!-- /.m_kv_contents .l_container-lg -->
</div>
<!-- /.m_kv -->