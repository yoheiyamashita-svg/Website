<footer class="l_footer">
  <div class="l_footer_contents">
    <div class="l_footer_info">
      <p class="l_footer-logo">
        <a href="<?php echo esc_url(home_url()); ?>" class="l_footer-logo_link">ZeroPlus</a>
      </p>
      <p class="l_footer_address">
        〒000-0000<br />
        東京都豊島区池袋0-00-0
      </p>
    </div>
    <!-- /.l_footer_info -->
    <div class="l_footer-nav" role="navigation">
      <ul class="l_footer-nav_list">
        <li class="l_footer-nav_item">
          <a href="<?php echo esc_url(home_url()); ?>" class="l_footer-nav_link">トップ</a>
        </li>
        <li class="l_footer-nav_item">
          <a href="<?php echo esc_url(home_url('/about')); ?>" class="l_footer-nav_link">私たちについて</a>
        </li>
        <li class="l_footer-nav_item">
          <a href="<?php echo esc_url(home_url('/service')); ?>" class="l_footer-nav_link">サービス</a>
        </li>
        <li class="l_footer-nav_item">
          <a href="<?php echo esc_url(get_post_type_archive_link('case')); ?>" class="l_footer-nav_link">事例</a>
        </li>
        <li class="l_footer-nav_item">
          <a href="<?php echo esc_url(home_url('/blog')); ?>" class="l_footer-nav_link">ブログ</a>
        </li>
        <li class="l_footer-nav_item">
          <a href="<?php echo esc_url(home_url('/contact')); ?>" class="l_footer-nav_link">お問い合わせ</a>
        </li>
      </ul>
    </div>
    <!-- /.l_footer-nav -->
  </div>
  <!-- /.l_footer_contents -->

  <p class="l_footer-copyright">
    <small class="l_footer-copyright_txt">&copy; 2018 sample inc.</small>
  </p>
</footer>
<?php wp_footer(); ?>
</body>

</html>