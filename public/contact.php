<?php

require_once('../config.php');
require_once('../functions.php');
require_once('../Post.php');

$post = new Post();
if($_SERVER['REQUEST_METHOD'] === 'POST') {
  $post->upload();
}
$errors = $post->getError();
?>
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <title>CONTACT | MASA-STUDIO.NET</title>
    <meta name="description" content="This is a portfolio website.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css">
    <link rel="stylesheet" href="../css/contact.css">
  </head>
  <body>
    <div id="grid_container">
      <div id="cell_0">
        <div class="menu_bar"> MASA STUDIO
          <div id="open" class="humberger">
            <div></div>
            <div></div>
          </div>
        </div>
        <div id="menu">
          <div id="close" class="humberger">
            <div></div>
            <div></div>
          </div>
          <ul>
            <li><a href="../index.html">HOME</a></li>
            <li><a href="../public/about.html">ABOUT</a></li>
            <li><a href="../public/portfolio.html">PORTFOLIO</a></li>
            <li><a href="../public/blog.html">BLOG</a></li>
            <li><a href="../public/contact.php">CONTACT</a></li>
          </ul>
        </div>
        <div id="cover"></div>
      </div>
      <div id="cell_1">
        <div class="logo logo2"><i class="far fa-paper-plane my-icon fa-6x"></i></div>
        <div class="text_box">
          <h1>Thank you for dropping by my website!</h1>
          <p>If you want to ask something about this website or me.<br> Please fill out the contact form.</p>
          <small>Please make sure below points in advance.</small><br>
          <small>* Name's form is within 15 letters.</small><br>
          <small>* Phone number's form can be used only number </small><br>
          <small>* No blank</small>
        </div>
      </div>
      <div id="cell_2">
        <h1>CONTACT</h1>
        <?php if(isset($errors)): ?>
          <div class="error"><?= h($errors); ?></div>
        <?php endif; ?>
        <form action="" method="post">
          <p><input type="text" name="name" placeholder="Your Name" required></p>
          <p><input type="email" name="email" placeholder="Your Email Adress" required></p>
          <p><input type="text" name="phone" placeholder="Your Phone Number" required></p>
          <textarea name="content" placeholder="Please write here within 300 letters." required></textarea>
          <input type="hidden" name="token" value="<?= h($_SESSION['token']); ?>">
          <button type="submit">SUBMIT</button>
        </form>
      </div>
    </div>
    <script src="../js/main.js"></script>
  </body>
</html>
