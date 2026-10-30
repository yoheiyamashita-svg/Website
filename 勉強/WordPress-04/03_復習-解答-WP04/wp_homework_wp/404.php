<!-- アクセスしたURLにページが存在しなかった場合に表示されるページ -->
<?php get_header(); ?>

<?php get_template_part('m_kv'); ?>

<main class="l_main notfound_main">
    <div class="l_contents">
        <div class="l_container-sm">
            <p class="notfound_title">お探しのページは<br class="u_lg-dn" />見つかりませんでした。</p>
            <p class="notfound_txt">
                ページが削除されたか、URLの入力間違いの可能性があります。<br class="notfound_txt-dn" />
                正しいURLをご入力いただくか、下記の項目からご覧になりたい情報をお探しください。
            </p>
        </div>
        <!-- /.l_container-sm -->
    </div>
    <!-- /.l_contents -->
</main>

<?php get_footer(); ?>