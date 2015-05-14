<?php
    $node = menu_get_object("node", 1, current_path());
    if (!empty($node) && $node->type == 'product') {
        $pdp_title = _deluxe_core_pdp_page_title();
        $page_title = $pdp_title;
    } else{
        $page_title = $title;
    }
?>
<div<?php print $attributes; ?>>
  <div<?php print $content_attributes; ?>>
    <a id="main-content"></a>
    <?php print render($title_prefix); ?>
    <?php if ($title): ?>
    <?php if ($title_hidden): ?><div class="element-invisible"><?php endif; ?>
    <h1 class="title" id="page-title"><?php print $page_title; ?></h1>
    <?php if ($title_hidden): ?></div><?php endif; ?>
    <?php endif; ?>
    <?php print render($title_suffix); ?>
    <?php if ($tabs && !empty($tabs['#primary'])): ?><div class="tabs clearfix"><?php print render($tabs); ?></div><?php endif; ?>
    <?php if ($action_links): ?><ul class="action-links"><?php print render($action_links); ?></ul><?php endif; ?>
    <?php print $content; ?>
    <?php if ($feed_icons): ?><div class="feed-icon clearfix"><?php print $feed_icons; ?></div><?php endif; ?>
  </div>
</div>
