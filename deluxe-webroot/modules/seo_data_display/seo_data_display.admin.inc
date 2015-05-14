<?php

//seo_data_display

/**
 * Form builder; Form for advanced module settings.
 */
function seo_profile_form_settings() {
  $form = array();
  $communities = node_load_multiple(array(), array('type' => 'community'));
  foreach ($communities as $key => $community) {
    $code = $community->field_community_code['und'][0]['value'];
    $form['seo_profile_'. $key] = array(
      '#type' => 'fieldset',
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#title' => 'Authentication for  ' . '<i style="color:blue">'. $community->title . '</i>',
    );

    $form['seo_profile_'. $key]['msvalidate_01_' . $code] = array(
      '#type' => 'textfield',
      '#title' => t('Enter msvalidate 01 '),
      '#default_value' => variable_get('msvalidate_01_' . $code, FALSE),
      '#size' => 30,
    );

    $form['seo_profile_'. $key]['y_key_' . $code] = array(
      '#type' => 'textfield',
      '#title' => t('Enter y_key '),
      '#default_value' => variable_get('y_key_' . $code, FALSE),
      '#size' => 30,
    );

    $form['seo_profile_'. $key]['domain_verify_' . $code] = array(
      '#type' => 'textfield',
      '#title' => t('Enter p:domain_verify key'),
      '#default_value' => variable_get('domain_verify_' . $code, FALSE),
      '#size' => 30,
    );

    $form['seo_profile_'. $key]['google_site_verification_' . $code] = array(
      '#type' => 'textfield',
      '#title' => t('Enter google site verification '),
      '#default_value' => variable_get('google_site_verification_' . $code, FALSE),
      '#size' => 30,
    );
  }
  return system_settings_form($form);
}
