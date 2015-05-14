<?php

/**
 * Page callback: Outputs JSON for taxonomy autocomplete suggestions.
 *
 * Path: taxonomy/autocomplete
 *
 * This callback outputs term name suggestions in response to Ajax requests
 * made by the taxonomy autocomplete widget for taxonomy term reference
 * fields. The output is a JSON object of plain-text term suggestions, keyed by
 * the user-entered value with the completed term name appended.  Term names
 * containing commas are wrapped in quotes.
 *
 * For example, suppose the user has entered the string 'red fish, blue' in the
 * field, and there are two taxonomy terms, 'blue fish' and 'blue moon'. The
 * JSON output would have the following structure:
 * @code
 *   {
 *     "red fish, blue fish": "blue fish",
 *     "red fish, blue moon": "blue moon",
 *   };
 * @endcode
 *
 * @param $field_name
 *   The name of the term reference field.
 * @param $tags_typed
 *   (optional) A comma-separated list of term names entered in the
 *   autocomplete form element. Only the last term is used for autocompletion.
 *   Defaults to '' (an empty string).
 *
 * @see taxonomy_menu()
 * @see taxonomy_field_widget_info()
 */
function community_store_autocomplete($field_name = '', $tags_typed = '') {
  // If the request has a '/' in the search text, then the menu system will have
  // split it into multiple arguments, recover the intended $tags_typed.
  $args = func_get_args();
  // Shift off the $field_name argument.
  array_shift($args);
  $tags_typed = implode('/', $args);

  $query = db_select('Store', 's', array('StoreID', 'Name'));
  $query->condition('s', 'CommunityID', $co_id);
  $stores = $query->execute()->fetchAll();

    foreach ($tags_return as $tid => $name) {
      $n = $name;
      // Term names containing commas or quotes must be wrapped in quotes.
      if (strpos($name, ',') !== FALSE || strpos($name, '"') !== FALSE) {
        $n = '"' . str_replace('"', '""', $name) . '"';
      }
      $term_matches[$prefix . $n] = check_plain($name);
    }
   drupal_json_output($term_matches);
}


/**
*
* @Return All communities from community table
**/
function community_autocomplete(){
  $query = db_select('community', 'c');
  $query->fields('c', array('co_name', 'co_id'));
  $query->condition('record_active', 'yes', '=');
  $communities = $query->execute()->fetchAll();
  $communities_list = array("_none" => "- None -");

  foreach($communities as $key => $community) {
    $communities_list[$community->co_id] = check_plain($community->co_name);
  }

  drupal_json_output($communities_list);
}

/* get taxonomy real name using vocablury name and term value */

function _deluxe_core_get_taxonomy_term_data( $vocabulary, $term ){

  /* get vid and name */
  $vocabulary_query = db_select('taxonomy_vocabulary', 'tv')
  ->fields('tv', array('vid', 'name'))
  ->condition('machine_name', '%' . db_like($vocabulary) . '%', 'LIKE');
  $vocabulary = $vocabulary_query->execute()->fetchAssoc();

  /*fetch term real name using vid */

  $taxonomy_query = db_select('taxonomy_term_data', 'ttd')
  ->fields('ttd', array('name'))
  ->condition('vid', $vocabulary['vid'], '=')
  ->condition('name', "'%"  . db_like($term) .  "%'", 'LIKE');
  $taxonomy = $taxonomy_query->execute()->fetchField();
  return $taxonomy;
}

function _deluxe_core_pdp_page_title(){
  $node_title = _deluxe_core_generate_breadcrumb();
  return  $node_title[1];
}
