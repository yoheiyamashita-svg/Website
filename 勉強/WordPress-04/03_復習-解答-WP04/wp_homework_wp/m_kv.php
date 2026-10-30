<div class="m_kv">
    <div class="l_container-lg">
        <div class="m_kv_box">
            <?php if((is_post_type_archive('case') || is_singular('case'))): ?>
            <h1 class="m_kv_title m_kv_title__case">事例</h1>
            <p class="m_kv_desc">
                弊社のマーケティングサポートの事例を<br class="u_lg-dn" />紹介します。
            </p>
            <?php elseif((is_page('about'))): ?>
            <h1 class="m_kv_title m_kv_title__about"><?php the_title(); ?></h1>
            <p class="m_kv_desc">
                弊社の代表からの挨拶、<br class="u_lg-dn" />会社概要について紹介します。
            </p>
            <?php elseif((is_page('service'))): ?>
            <h1 class="m_kv_title m_kv_title__service"><?php the_title(); ?></h1>
            <p class="m_kv_desc">
                弊社のマーケティングサポートの事例を<br class="u_lg-dn" />紹介します。
            </p>
            <?php elseif((is_page('contact'))): ?>
            <h1 class="m_kv_title m_kv_title__contact"><?php the_title(); ?></h1>
            <p class="m_kv_desc">
                お申し込みフォームにて、<br class="u_lg-dn" />お問い合わせ内容をご記入ください。
            </p>
            <?php elseif((is_page('privacy'))): ?>
            <h1 class="m_kv_title m_kv_title__privacy"><?php the_title(); ?></h1>
            <p class="m_kv_desc">
                以下の方針でお客様の個人情報を<br class="u_lg-dn" />取り扱います。
            </p>
            <?php elseif((is_404())): ?>
            <h1 class="m_kv_title m_kv_title__404">404</h1>
            <p class="m_kv_desc">
                申し訳ございません。<br class="u_lg-dn" />指定のページにアクセスできません。
            </p>
            <?php else: ?>
            <h1 class="m_kv_title">
                <?php the_title(); ?>
            </h1>
            <?php endif; ?>
        </div>
    </div>
    <!-- /.l_container-lg -->
</div>
<!-- /.m_kv -->