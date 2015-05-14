<?php

/**
 * @file
 * This file is empty by default because the base theme chain (Alpha & Omega) provides
 * all the basic functionality. However, in case you wish to customize the output that Drupal
 * generates through Alpha & Omega this file is a good place to do so.
 *
 * Alpha comes with a neat solution for keeping this file as clean as possible while the code
 * for your subtheme grows. Please read the README.txt in the /preprocess and /process subfolders
 * for more information on this topic.
 */

function deluxe_core_preprocess_html(&$vars) {
  $site = explode('.', $_SERVER['SERVER_NAME']);
  $vars['classes_array'][] = 'domain-' . $site[0];
  drupal_add_css(drupal_get_path('theme', 'deluxe_core') . '/css/global-'. $site[0] . '.css');
}

function deluxe_core_breadcrumb($variables) {
  //if (strpos(current_path(), 'node')){
  $node = menu_get_object("node", 1, current_path());

  if ( (count($variables['breadcrumb']) > 0) && ( $node->type == 'product')) {
    unset($variables['breadcrumb']);
    $variables['breadcrumb'] = _deluxe_core_generate_breadcrumb();

    $lastitem = sizeof($variables['breadcrumb']);
     $title = drupal_get_title();
     $crumbs = '<ul class="breadcrumbs">';
     $a=1;
     foreach($variables['breadcrumb'] as $value) {
         if ($a!=$lastitem){
          $crumbs .= '<b><li class="breadcrumb-'.$a.'">'. $value . ' > ' . ' </li></b>';
          $a++;
         }
         else {
             $crumbs .= '<li class="breadcrumb-last"> '.$value.'</li>';
         }
     }
     $crumbs .= '</ul>';
   drupal_set_title($value .' ');
   return $crumbs;

   }
   else {
     return t("Home");
   }
 //}
}


function deluxe_core_preprocess_page(&$variables){
  /* add SEO meta tags on page id basic*/
  if ($variables['is_front'] == FALSE):
  $metaifo = _seo_data_display_generate_tags();
  $i = 0;
  $page_keywords = array();
  foreach($metaifo as $key => $meta_tag){
    $meta_keys = array_keys($meta_tag);
    $meta_meta_links = current($meta_keys);
    $meta_name = next($meta_keys);
    $meta_content = next($meta_keys);
    $meta_page_data[$i] = array(
        '#type' => 'html_tag',
        '#tag' => $meta_tag[$meta_meta_links],
        '#attributes' => array(
            $meta_name => $meta_tag[$meta_name],
            $meta_content => $meta_tag[$meta_content]
        ),
        '#weight' => 999 + $i
    );
    if(!empty($meta_tag[$meta_content]))
    drupal_add_html_head($meta_page_data[$i],'$meta_page_data' . $i);
    $i++;
  }
  endif;
}
