<?php

require_once('../config.php');
require_once('../functions.php');
require_once('../Post.php');

// instance
$post = new Post();
$records = $post->showAll();
?>

<!DOCTYPE html>
<html lang="ja">
  <head>
  </head>
  <body>
    <table border="2">
      <thead style="background-color: skyblue;">
        <tr><th>name</th><th>mail</th><th>phone</th><th>content</th><th>posted</th></tr>
      </thead>
      <tbody>
      <?php foreach($records as $record) :?>
        <tr>
          <td><?php print h($record->name); ?></td>
          <td><?php print h($record->email); ?></td>
          <td><?php print h($record->phone_number); ?></td>
          <td><?php print h($record->content); ?></td>
          <td><?php print h($record->posted); ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    <table>
  </body>
</html>
